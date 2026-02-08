/**
 * Calculate Tax Handler
 * 
 * HTTP handler for calculating property tax savings
 * Orchestrates cache check, scraping, and calculation
 */

const { scrapePropertyData } = require('../services/zillowScraper');
const { getPropertyData, savePropertyDataWithCalculations } = require('../services/firestoreService');
const { calculateTaxAnalysis } = require('../services/taxCalculator');
const { validateAddress } = require('../utils/addressUtils');
const { config } = require('../config');
const logger = require('../utils/logger');

/**
 * Handle calculate tax requests
 * @param {Object} req - HTTP request object
 * @param {Object} res - HTTP response object
 */
async function calculateTax(req, res) {
  const requestId = generateRequestId();
  const startTime = Date.now();

  // Set CORS headers
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return;
  }

  // Only accept POST requests
  if (req.method !== 'POST') {
    res.status(405).json({
      success: false,
      error: {
        code: 'METHOD_NOT_ALLOWED',
        message: 'Only POST requests are accepted.'
      }
    });
    return;
  }

  logger.info('Calculate tax request received', { requestId });

  try {
    const { address } = req.body;

    // Validate input
    const validation = validateAddress(address);
    if (!validation.valid) {
      res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_INPUT',
          message: validation.error,
          details: 'Please provide a valid property address'
        },
        metadata: { requestId }
      });
      return;
    }

    const trimmedAddress = address.trim();
    logger.info('Processing calculate tax request', { requestId, address: trimmedAddress });

    // Step 1: Check Firestore cache
    let propertyData = null;
    let calculations = null;
    let cacheHit = false;

    if (config.cache.enableCache) {
      logger.info('Checking Firestore cache', { requestId, address: trimmedAddress });
      const cached = await getPropertyData(trimmedAddress);
      
      if (cached && cached.calculations) {
        cacheHit = true;
        propertyData = cached;
        calculations = cached.calculations;
        logger.info('Cache hit - returning cached calculations', { 
          requestId, 
          address: trimmedAddress,
          calculatedAt: calculations.calculatedAt,
        });
      } else if (cached) {
        // Have scraped data but no calculations - calculate now
        propertyData = cached;
        logger.info('Cache hit (scraped data only) - calculating now', { 
          requestId, 
          address: trimmedAddress 
        });
      } else {
        logger.info('Cache miss - will scrape and calculate', { requestId, address: trimmedAddress });
      }
    }

    // Step 2: Scrape if needed
    if (!propertyData) {
      logger.info('Scraping property data from Zillow', { requestId, address: trimmedAddress });
      propertyData = await scrapePropertyData(trimmedAddress);

      if (!propertyData) {
        res.status(404).json({
          success: false,
        error: {
          code: 'PROPERTY_NOT_FOUND',
          message: 'Property data not found.',
          details: 'No data available for the provided address. Please verify the address and try again.'
        },
          metadata: { requestId, address: trimmedAddress }
        });
        return;
      }
    }

    // Step 3: Calculate if needed
    if (!calculations) {
      try {
        logger.info('Calculating tax analysis', { requestId, address: trimmedAddress });
        calculations = calculateTaxAnalysis(propertyData);
      } catch (calcError) {
        logger.error('Tax calculation failed', {
          requestId,
          address: trimmedAddress,
          error: calcError.message,
        });

        res.status(400).json({
          success: false,
          error: {
            code: 'CALCULATION_ERROR',
            message: calcError.message,
            details: 'Unable to calculate tax analysis for this property'
          },
          metadata: { requestId, address: trimmedAddress }
        });
        return;
      }
    }

    // Step 4: Save to Firestore if this was a fresh scrape/calculation
    // Fire-and-forget: don't block the response on cache writes
    if (!cacheHit) {
      logger.info('Saving data and calculations to Firestore (async)', { requestId, address: trimmedAddress });
      savePropertyDataWithCalculations(trimmedAddress, propertyData, calculations)
        .then(() => {
          logger.info('Firestore save completed', { requestId, address: trimmedAddress });
        })
        .catch((saveError) => {
          logger.error('Failed to save to Firestore', {
            requestId,
            address: trimmedAddress,
            error: saveError.message,
          });
        });
    }

    const latencyMs = Date.now() - startTime;
    
    // Collect warnings (e.g., address mismatch)
    const warnings = propertyData.warnings || [];
    
    logger.info('Calculate tax request completed', { 
      requestId, 
      latencyMs,
      address: trimmedAddress,
      cacheHit,
      potentialSavings: calculations.potentialSavings,
      warningsCount: warnings.length,
    });

    // Build response
    const response = {
      success: true,
      data: {
        property: {
          address: propertyData.address || trimmedAddress,
          purchaseHistory: propertyData.purchaseHistory || [],
          taxHistory: propertyData.taxHistory || [],
          marketEstimate: propertyData.marketEstimate,
        },
        calculations: {
          taxRatePercent: calculations.taxRatePercent,
          derivedFromYear: calculations.derivedFromYear,
          currentAssessedValue: calculations.currentAssessedValue,
          currentAssessedYear: calculations.currentAssessedYear,
          marketEstimate: calculations.marketEstimate,
          currentTaxBill: calculations.currentTaxBill,
          reducedTaxBill: calculations.reducedTaxBill,
          potentialSavings: calculations.potentialSavings,
          potentialSavingsPercent: calculations.potentialSavingsPercent,
        },
      },
      metadata: {
        requestId,
        cacheHit,
        calculatedAt: calculations.calculatedAt,
        calculationVersion: calculations.calculationVersion,
        latencyMs,
      },
    };
    
    // Add warnings if any (e.g., address mismatch)
    if (warnings.length > 0) {
      response.warnings = warnings;
    }
    
    res.status(200).json(response);

  } catch (error) {
    const latencyMs = Date.now() - startTime;

    logger.error('Calculate tax request failed', {
      requestId,
      error: error.message,
      stack: error.stack,
      latencyMs,
    });

    // Determine error type and status code
    let statusCode = 500;
    let errorCode = 'INTERNAL_ERROR';
    let errorMessage = 'An unexpected error occurred while calculating property tax.';

    if (error.message.includes('APIFY_API_KEY')) {
      statusCode = 503;
      errorCode = 'SERVICE_UNAVAILABLE';
      errorMessage = 'Property data service is not configured.';
    } else if (error.message.includes('timeout')) {
      statusCode = 504;
      errorCode = 'GATEWAY_TIMEOUT';
      errorMessage = 'Property data service timed out. Please try again.';
    } else if (error.message.includes('Failed to scrape')) {
      statusCode = 503;
      errorCode = 'SERVICE_UNAVAILABLE';
      errorMessage = 'Property data service is temporarily unavailable.';
    }

    res.status(statusCode).json({
      success: false,
      error: {
        code: errorCode,
        message: errorMessage,
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      metadata: {
        requestId,
        latencyMs,
      }
    });
  }
}

/**
 * Generate a unique request ID for tracing
 * @returns {string} Request ID
 */
function generateRequestId() {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

module.exports = {
  calculateTax,
};

