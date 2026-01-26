/**
 * Firestore Service for Property Tax Calculator
 * Handles property data storage with version history and calculations
 * 
 * Document Schema:
 * - address, purchaseHistory, taxHistory, marketEstimate (scraped data)
 * - calculations: { taxRatePercent, currentTaxBill, ... } (calculated data)
 * - scrapedAt, scrapeCount (existing)
 * - expiresAt, createdAt, updatedAt (timestamps)
 * 
 * Version History Logic:
 * - Cache hit (< 30 days): Return cached data, no new scrape
 * - Cache miss (> 30 days): Create new version in subcollection, update main document
 */

const { Firestore } = require('@google-cloud/firestore');
const { config } = require('../config');
const logger = require('../utils/logger');

// Initialize Firestore
const db = new Firestore({
  projectId: config.gcp.projectId,
});

/**
 * Get property data from Firestore cache
 * @param {string} address - Property address
 * @returns {Promise<Object|null>} Property data or null if not found/expired
 */
async function getPropertyData(address) {
  const docId = hashAddress(address);
  const collectionName = config.gcp.firestore.properties;

  try {
    const docRef = db.collection(collectionName).doc(docId);
    const doc = await docRef.get();
    
    if (!doc.exists) {
      logger.info('Property data not found in cache', { address, docId });
      return null;
    }

    const data = doc.data();
    
    // Check if cache is expired
    if (isCacheExpired(data.scrapedAt)) {
      logger.info('Property data cache expired', { 
        address,
        lastScraped: data.scrapedAt ? data.scrapedAt.toDate().toISOString() : 'unknown',
        ttlDays: config.cache.ttlDays
      });
      return null;
    }

    logger.info('Property data retrieved from cache', { 
      address,
      scrapedAt: data.scrapedAt.toDate().toISOString(),
      scrapeCount: data.scrapeCount || 1
    });
    
    return data;

  } catch (error) {
    logger.error('Failed to get property data from Firestore', {
      error: error.message,
      address,
      docId,
    });
    return null;
  }
}

/**
 * Save scraped property data to Firestore with version history
 * @param {string} address - Property address
 * @param {Object} propertyData - Scraped property data
 * @returns {Promise<Object>} Metadata about the save operation
 */
async function savePropertyData(address, propertyData) {
  const docId = hashAddress(address);
  const collectionName = config.gcp.firestore.properties;
  
  logger.info('Saving property data to Firestore', {
    collection: collectionName,
    docId,
    address,
  });

  try {
    const docRef = db.collection(collectionName).doc(docId);
    const doc = await docRef.get();
    
    const isNewProperty = !doc.exists;
    let scrapeCount = 1;
    
    // If property exists, check if we should save version history
    if (!isNewProperty) {
      const existingData = doc.data();
      scrapeCount = (existingData.scrapeCount || 1) + 1;
      
      // Save current data to version history subcollection
      const timestamp = Date.now();
      const versionId = `${timestamp}`;
      
      await docRef.collection('scrapes').doc(versionId).set({
        ...existingData,
        // Keep original scrapedAt for this version
      });
      
      logger.info('Saved version to history', {
        address,
        versionId,
        scrapeCount: scrapeCount - 1,
      });
    }
    
    // Update main document with new data
    await docRef.set({
      address,
      ...propertyData,
      scrapedAt: Firestore.FieldValue.serverTimestamp(),
      scrapeCount,
    });

    logger.info('Property data saved successfully', { 
      docId,
      address,
      scrapeCount,
      isNewProperty,
    });
    
    return {
      docId,
      scrapeCount,
      isNewProperty,
      versionHistoryCreated: !isNewProperty,
    };

  } catch (error) {
    logger.error('Failed to save property data to Firestore', {
      error: error.message,
      stack: error.stack,
      docId,
      address,
    });
    throw error;
  }
}

/**
 * Save property data with calculations to Firestore
 * Combines scraped data and calculated tax analysis into single document
 * @param {string} address - Property address
 * @param {Object} propertyData - Scraped property data (purchaseHistory, taxHistory, marketEstimate)
 * @param {Object} calculations - Calculated tax analysis results
 * @returns {Promise<Object>} Metadata about the save operation
 */
async function savePropertyDataWithCalculations(address, propertyData, calculations) {
  const docId = hashAddress(address);
  const collectionName = config.gcp.firestore.properties;
  
  logger.info('Saving property data with calculations to Firestore', {
    collection: collectionName,
    docId,
    address,
    hasCalculations: !!calculations,
  });

  try {
    const docRef = db.collection(collectionName).doc(docId);
    const doc = await docRef.get();
    
    const isNewProperty = !doc.exists;
    let scrapeCount = 1;
    const now = new Date();
    const expiresAt = new Date(now.getTime() + (config.cache.ttlDays * 24 * 60 * 60 * 1000));
    
    // If property exists, save to version history
    if (!isNewProperty) {
      const existingData = doc.data();
      scrapeCount = (existingData.scrapeCount || 1) + 1;
      
      // Save current data to version history subcollection
      const timestamp = Date.now();
      const versionId = `${timestamp}`;
      
      await docRef.collection('scrapes').doc(versionId).set({
        ...existingData,
        // Keep original timestamps for this version
      });
      
      logger.info('Saved version to history', {
        address,
        versionId,
        scrapeCount: scrapeCount - 1,
      });
    }
    
    // Build the document
    const documentData = {
      // Address
      address: propertyData.address || address,
      
      // Scraped data
      purchaseHistory: propertyData.purchaseHistory || [],
      taxHistory: propertyData.taxHistory || [],
      marketEstimate: propertyData.marketEstimate || null,
      
      // Calculated data
      calculations: calculations || null,
      
      // Timestamps
      scrapedAt: Firestore.FieldValue.serverTimestamp(),
      scrapeCount,
      expiresAt,
      updatedAt: Firestore.FieldValue.serverTimestamp(),
    };

    // Only set createdAt for new documents
    if (isNewProperty) {
      documentData.createdAt = Firestore.FieldValue.serverTimestamp();
    }
    
    // Update/create main document
    if (isNewProperty) {
      await docRef.set(documentData);
    } else {
      // Don't overwrite createdAt
      delete documentData.createdAt;
      await docRef.set(documentData, { merge: true });
    }

    logger.info('Property data with calculations saved successfully', { 
      docId,
      address,
      scrapeCount,
      isNewProperty,
      hasCalculations: !!calculations,
      potentialSavings: calculations?.potentialSavings,
    });
    
    return {
      docId,
      scrapeCount,
      isNewProperty,
      versionHistoryCreated: !isNewProperty,
    };

  } catch (error) {
    logger.error('Failed to save property data with calculations to Firestore', {
      error: error.message,
      stack: error.stack,
      docId,
      address,
    });
    throw error;
  }
}

/**
 * Hash address to create a consistent document ID
 * Normalizes address to prevent duplicate records
 * @param {string} address - Property address
 * @returns {string} Hashed address suitable for Firestore document ID
 */
function hashAddress(address) {
  // Normalize: lowercase, trim, replace special chars with hyphens
  return address
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '') // Remove leading/trailing hyphens
    .substring(0, 100); // Firestore doc ID limit is 1500, keeping it short
}

/**
 * Check if cached data is expired based on TTL
 * @param {Object} scrapedAt - Firestore timestamp
 * @returns {boolean} True if expired
 */
function isCacheExpired(scrapedAt) {
  if (!scrapedAt) return true;
  
  if (!config.cache.enableCache) {
    logger.debug('Cache disabled, treating as expired');
    return true;
  }
  
  const now = Date.now();
  const scrapedTime = scrapedAt.toDate().getTime();
  const ttlMs = config.cache.ttlDays * 24 * 60 * 60 * 1000;
  
  const isExpired = (now - scrapedTime) > ttlMs;
  
  logger.debug('Cache expiration check', {
    scrapedTime: new Date(scrapedTime).toISOString(),
    now: new Date(now).toISOString(),
    ttlDays: config.cache.ttlDays,
    isExpired,
  });
  
  return isExpired;
}

/**
 * Get version history for a property
 * @param {string} address - Property address
 * @param {number} limit - Maximum number of versions to retrieve
 * @returns {Promise<Array>} Array of historical scrapes
 */
async function getVersionHistory(address, limit = 10) {
  const docId = hashAddress(address);
  const collectionName = config.gcp.firestore.properties;

  try {
    const versionsSnapshot = await db
      .collection(collectionName)
      .doc(docId)
      .collection('scrapes')
      .orderBy('scrapedAt', 'desc')
      .limit(limit)
      .get();
    
    const versions = [];
    versionsSnapshot.forEach(doc => {
      versions.push({
        id: doc.id,
        ...doc.data(),
      });
    });
    
    logger.info('Retrieved version history', {
      address,
      versionCount: versions.length,
    });
    
    return versions;

  } catch (error) {
    logger.error('Failed to get version history', {
      error: error.message,
      address,
    });
    return [];
  }
}

module.exports = {
  getPropertyData,
  savePropertyData,
  savePropertyDataWithCalculations,
  getVersionHistory,
  db, // Export for advanced usage if needed
};


