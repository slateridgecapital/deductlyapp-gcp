/**
 * Zillow Property Data Scraper Service
 * 
 * Uses Apify's Zillow Detail Scraper to fetch property data including:
 * - Purchase history
 * - Tax history (supports incomplete entries like 2025 assessment without tax paid)
 * - Market estimate (zestimate)
 * - Comparable homes
 * 
 * Features:
 * - Address mismatch detection with warnings
 */

const { ApifyClient } = require('apify-client');
const { config } = require('../config');
const logger = require('../utils/logger');

/**
 * Clean address for Zillow search
 * Remove "USA" suffix and normalize format for better Zillow matching
 * @param {string} address - Address string
 * @returns {string} Cleaned address
 */
function cleanAddressForZillow(address) {
  if (!address) return address;
  
  let cleaned = address.trim();
  
  // Remove ", USA" or ", United States" from the end
  cleaned = cleaned.replace(/,\s*(USA|United States|U\.S\.A\.)$/i, '');
  
  // Normalize multiple spaces
  cleaned = cleaned.replace(/\s+/g, ' ');
  
  return cleaned.trim();
}

/**
 * Extract unit number from address string
 * @param {string} address - Address string
 * @returns {string|null} Unit number or null
 */
function extractUnitNumber(address) {
  if (!address) return null;
  
  // Match patterns like #11G, APT 11G, Unit 11G, etc.
  const patterns = [
    /#\s*([A-Za-z0-9]+)/i,           // #11G
    /apt\.?\s*([A-Za-z0-9]+)/i,      // APT 11G, apt. 11g
    /unit\s*([A-Za-z0-9]+)/i,        // Unit 11G
    /ste\.?\s*([A-Za-z0-9]+)/i,      // Ste 11G, ste. 11g
    /suite\s*([A-Za-z0-9]+)/i,       // Suite 11G
  ];
  
  for (const pattern of patterns) {
    const match = address.match(pattern);
    if (match) {
      return match[1].toUpperCase();
    }
  }
  
  return null;
}

/**
 * Compare requested address with returned address and generate warnings
 * @param {string} requestedAddress - Original address from user
 * @param {string} returnedAddress - Address returned by Zillow
 * @returns {Array} Array of warning strings
 */
function validateAddressMatch(requestedAddress, returnedAddress) {
  const warnings = [];
  
  if (!requestedAddress || !returnedAddress) {
    return warnings;
  }
  
  const requestedUnit = extractUnitNumber(requestedAddress);
  const returnedUnit = extractUnitNumber(returnedAddress);
  
  // Check unit number mismatch
  if (requestedUnit && returnedUnit && requestedUnit !== returnedUnit) {
    warnings.push(
      `Address mismatch: Requested unit '${requestedUnit}' but Zillow returned unit '${returnedUnit}'. ` +
      `Please verify this is the correct property.`
    );
    logger.warn('Address unit mismatch detected', {
      requestedAddress,
      returnedAddress,
      requestedUnit,
      returnedUnit,
    });
  }
  
  return warnings;
}

/**
 * Scrape property data from Zillow via Apify
 * @param {string} address - Property address
 * @returns {Promise<Object>} Transformed property data with warnings
 */
async function scrapePropertyData(address) {
  if (!config.apify.apiKey) {
    throw new Error('APIFY_API_KEY is not configured');
  }

  const client = new ApifyClient({
    token: config.apify.apiKey,
  });

  // Clean address for better Zillow matching
  const cleanedAddress = cleanAddressForZillow(address);
  
  logger.info('Starting Zillow scraper', { 
    originalAddress: address,
    cleanedAddress,
    actorId: config.apify.zillowActorId 
  });

  try {
    // Run the Zillow scraper actor
    const run = await client.actor(config.apify.zillowActorId).call({
      addresses: [cleanedAddress],
      // Note: Removed propertyStatus filter to search all properties, not just recently sold
    }, {
      timeout: config.apify.timeoutMs,
    });

    logger.info('Zillow scraper completed', { 
      runId: run.id,
      status: run.status 
    });

    // Fetch the dataset results
    const { items } = await client.dataset(run.defaultDatasetId).listItems();

    if (!items || items.length === 0) {
      logger.warn('No property data found', { address });
      return null;
    }

    const rawData = items[0];

    
    // Log full raw JSON for debugging
    logger.debug('Raw Zillow data', { 
      address,
      rawData: JSON.stringify(rawData, null, 2) 
    });

    // Transform to simplified structure
    const transformedData = transformPropertyData(rawData);
    
    // Check for address mismatch and add warnings
    const warnings = validateAddressMatch(address, transformedData.address);
    transformedData.warnings = warnings;
    
    logger.info('Property data transformed', { 
      requestedAddress: address,
      returnedAddress: transformedData.address,
      hasMarketEstimate: transformedData.marketEstimate !== null,
      purchaseHistoryCount: transformedData.purchaseHistory.length,
      taxHistoryCount: transformedData.taxHistory.length,
      warningsCount: warnings.length,
    });

    return transformedData;

  } catch (error) {
    logger.error('Zillow scraper failed', { 
      address,
      error: error.message,
      stack: error.stack 
    });
    throw new Error(`Failed to scrape property data: ${error.message}`);
  }
}

/**
 * Transform raw Zillow data to simplified structure
 * @param {Object} rawData - Raw data from Zillow scraper
 * @returns {Object} Transformed data
 */
function transformPropertyData(rawData) {
  return {
    address: formatAddress(rawData.address),
    purchaseHistory: extractPurchaseHistory(rawData.priceHistory),
    taxHistory: extractTaxHistory(rawData.taxHistory),
    marketEstimate: rawData.zestimate || null,
  };
}

/**
 * Format address as a string
 * @param {Object} address - Address object from Zillow
 * @returns {string} Formatted address
 */
function formatAddress(address) {
  if (!address) return null;
  
  const parts = [
    address.streetAddress,
    address.city,
    address.state,
    address.zipcode,
  ].filter(Boolean);
  
  return parts.join(', ');
}

/**
 * Extract purchase history from price history
 * @param {Array} priceHistory - Price history array from Zillow
 * @returns {Array} Purchase history with date and price
 */
function extractPurchaseHistory(priceHistory) {
  if (!Array.isArray(priceHistory)) {
    return [];
  }

  const purchases = priceHistory
    .filter(item => item.event === 'Sold' && item.price && item.date)
    .map(item => ({
      date: item.date,
      price: item.price,
    }))
    .sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort descending (most recent first)

  return purchases;
}

/**
 * Extract and transform tax history
 * Allows incomplete entries (e.g., 2025 assessment with no taxPaid yet)
 * @param {Array} taxHistory - Tax history array from Zillow
 * @returns {Array} Tax history entries sorted by year descending
 */
function extractTaxHistory(taxHistory) {
  if (!Array.isArray(taxHistory)) {
    return [];
  }

  const taxes = taxHistory
    // Only require assessedValue and time; taxPaid can be null for incomplete entries
    .filter(item => item.value && item.time)
    .map(item => {
      const year = new Date(item.time).getFullYear();
      const assessedValue = item.value;
      // taxPaid may be null for recent years (e.g., 2025 assessment not yet paid)
      const taxPaid = item.taxPaid ? Math.round(item.taxPaid) : null;

      return {
        year,
        taxPaid,
        assessedValue: Math.round(assessedValue),
      };
    })
    .sort((a, b) => b.year - a.year); // Sort descending (most recent first)

  return taxes;
}

/**
 * Extract comparable homes data
 * @param {Array} comps - Comparable homes array from Zillow
 * @returns {Array} Simplified comparable homes data
 */
function extractComparableHomes(comps) {
  // Debug logging to see what Zillow returns
  logger.debug('Raw comps data from Zillow', { 
    compsIsArray: Array.isArray(comps),
    compsLength: Array.isArray(comps) ? comps.length : 0,
    compsType: typeof comps,
    compsValue: comps ? JSON.stringify(comps).substring(0, 500) : 'null/undefined'
  });

  if (!Array.isArray(comps)) {
    logger.warn('Comps is not an array', { compsType: typeof comps });
    return [];
  }

  if (comps.length === 0) {
    logger.info('Zillow returned empty comps array');
    return [];
  }

  const comparables = comps
    .filter(comp => {
      const hasAddress = !!comp.address;
      const hasPrice = !!comp.price;
      if (!hasAddress || !hasPrice) {
        logger.debug('Filtering out comp due to missing data', {
          zpid: comp.zpid,
          hasAddress,
          hasPrice,
          address: comp.address,
          price: comp.price
        });
      }
      return hasAddress && hasPrice;
    })
    .map(comp => ({
      address: formatAddress(comp.address),
      status: comp.homeStatus || 'UNKNOWN',
      price: comp.price,
      bedrooms: comp.bedrooms || null,
      bathrooms: comp.bathrooms || null,
      sqft: comp.livingArea || comp.livingAreaValue || null,
    }));

  logger.info('Extracted comparable homes', {
    totalComps: comps.length,
    filteredComps: comparables.length
  });

  return comparables;
}

module.exports = {
  scrapePropertyData,
};

