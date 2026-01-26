/**
 * Property Tax Service - Cloud Function Entry Point
 * 
 * Single Cloud Function with path-based routing:
 * - /calculate (default): Calculate property tax savings
 * - /scrape: Scrape property data from Zillow
 * 
 * @see README.md for full documentation
 */

// Load environment variables from .env file (for local development)
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const functions = require('@google-cloud/functions-framework');
const { config, validateConfig } = require('./src/config');
const logger = require('./src/utils/logger');
const { scrapeProperty } = require('./src/handlers/scrapeProperty');
const { calculateTax } = require('./src/handlers/calculateTax');

// Validate configuration on cold start
const configValidation = validateConfig();
if (!configValidation.valid) {
  logger.error('Missing required configuration', { 
    missing: configValidation.missing 
  });
}

/**
 * Main Cloud Function handler with path-based routing
 * 
 * Routes:
 * - POST / or /calculate: Calculate property tax savings
 * - POST /scrape or /scrape-property: Scrape property data only
 */
functions.http('handleRequest', async (req, res) => {
  const path = req.path || '/';
  
  logger.info('Request received', { 
    path,
    method: req.method,
  });

  // Route based on path
  if (path === '/scrape' || path === '/scrape-property') {
    // Scrape endpoint - returns raw property data
    return scrapeProperty(req, res);
  } else if (path === '/calculate' || path === '/') {
    // Calculate endpoint (default) - returns tax analysis
    return calculateTax(req, res);
  } else {
    // Unknown endpoint
    res.status(404).json({
      success: false,
      error: {
        code: 'NOT_FOUND',
        message: `Endpoint '${path}' not found`,
        details: 'Available endpoints: /calculate (default), /scrape'
      }
    });
  }
});

// Export for testing
module.exports = { 
  handleRequest: functions.http,
  scrapeProperty,
  calculateTax,
};
