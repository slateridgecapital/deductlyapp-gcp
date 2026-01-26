/**
 * Scrape Property Handler
 * 
 * HTTP handler for scraping property data from Zillow via Apify
 * Includes Firestore caching with version history (30-day TTL)
 */

const { scrapePropertyData } = require('../services/zillowScraper');
const { getPropertyData, savePropertyData } = require('../services/firestoreService');
const { config } = require('../config');
const logger = require('../utils/logger');

/**
 * Handle scrape property requests
 * @param {Object} req - HTTP request object
 * @param {Object} res - HTTP response object
 */
async function scrapeProperty(req, res) {
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
        message: 'Only POST requests are accepted'
      }
    });
    return;
  }

  logger.info('Scrape property request received', { requestId });

  try {
    const { address } = req.body;

    // Validate input
    if (!address || typeof address !== 'string' || address.trim() === '') {
      res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_INPUT',
          message: 'Address is required',
          details: 'Please provide a valid property address'
        },
        metadata: {
          requestId,
        }
      });
      return;
    }

    const trimmedAddress = address.trim();
    
    logger.info('Processing scrape property request', { requestId, address: trimmedAddress });

    // Check Firestore cache first (if enabled)
    let propertyData = null;
    let cacheHit = false;
    
    if (config.cache.enableCache) {
      logger.info('Checking Firestore cache', { requestId, address: trimmedAddress });
      propertyData = await getPropertyData(trimmedAddress);
      
      if (propertyData) {
        cacheHit = true;
        logger.info('Cache hit - returning cached data', { 
          requestId, 
          address: trimmedAddress,
          scrapedAt: propertyData.scrapedAt ? propertyData.scrapedAt.toDate().toISOString() : 'unknown',
          scrapeCount: propertyData.scrapeCount || 1,
        });
      } else {
        logger.info('Cache miss - will scrape fresh data', { requestId, address: trimmedAddress });
      }
    }
    
    // If no cached data, scrape from Zillow
    if (!propertyData) {
      logger.info('Scraping property data from Zillow', { requestId, address: trimmedAddress });
      propertyData = await scrapePropertyData(trimmedAddress);
    }

    if (!propertyData) {
      res.status(404).json({
        success: false,
        error: {
          code: 'PROPERTY_NOT_FOUND',
          message: 'Property data not found',
          details: 'No data available for the provided address. Please verify the address and try again.'
        },
        metadata: {
          requestId,
          address: trimmedAddress,
        }
      });
      return;
    }

    // Save to Firestore if this was a fresh scrape
    let saveMetadata = null;
    if (!cacheHit) {
      try {
        logger.info('Saving fresh scrape to Firestore', { requestId, address: trimmedAddress });
        saveMetadata = await savePropertyData(trimmedAddress, propertyData);
        logger.info('Data saved to Firestore', { 
          requestId, 
          address: trimmedAddress,
          scrapeCount: saveMetadata.scrapeCount,
          isNewProperty: saveMetadata.isNewProperty,
        });
      } catch (error) {
        // Log error but don't fail the request
        logger.error('Failed to save to Firestore', {
          requestId,
          address: trimmedAddress,
          error: error.message,
        });
      }
    }

    const latencyMs = Date.now() - startTime;
    
    // Collect warnings (e.g., address mismatch)
    const warnings = propertyData.warnings || [];
    
    logger.info('Scrape property request completed', { 
      requestId, 
      latencyMs,
      address: trimmedAddress,
      cacheHit,
      warningsCount: warnings.length,
    });

    // Build response
    const response = {
      success: true,
      data: propertyData,
      metadata: {
        requestId,
        cacheHit,
        scrapedAt: propertyData.scrapedAt 
          ? (propertyData.scrapedAt.toDate ? propertyData.scrapedAt.toDate().toISOString() : propertyData.scrapedAt)
          : new Date().toISOString(),
        scrapeCount: propertyData.scrapeCount || (saveMetadata ? saveMetadata.scrapeCount : 1),
        cacheTtlDays: config.cache.ttlDays,
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

    logger.error('Scrape property request failed', {
      requestId,
      error: error.message,
      stack: error.stack,
      latencyMs,
    });

    // Determine error type and status code
    let statusCode = 500;
    let errorCode = 'INTERNAL_ERROR';
    let errorMessage = 'An unexpected error occurred while scraping property data';

    if (error.message.includes('APIFY_API_KEY')) {
      statusCode = 503;
      errorCode = 'SERVICE_UNAVAILABLE';
      errorMessage = 'Property data service is not configured';
    } else if (error.message.includes('timeout')) {
      statusCode = 504;
      errorCode = 'GATEWAY_TIMEOUT';
      errorMessage = 'Property data service timed out. Please try again.';
    } else if (error.message.includes('Failed to scrape')) {
      statusCode = 503;
      errorCode = 'SERVICE_UNAVAILABLE';
      errorMessage = 'Property data service is temporarily unavailable';
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
  scrapeProperty,
};

