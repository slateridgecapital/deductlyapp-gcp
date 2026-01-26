/**
 * Configuration management for the Property Tax Calculator service
 * Following GCP naming conventions: property-tax-{resource}
 */

const APP_NAME = 'property-tax';
const SERVICE_NAME = 'calculator';

const config = {
  // Application metadata
  app: {
    name: APP_NAME,
    service: SERVICE_NAME,
    fullName: `${APP_NAME}-${SERVICE_NAME}`,
  },

  // Service configuration
  service: {
    maxRetries: parseInt(process.env.MAX_RETRIES, 10) || 3,
    requestTimeout: parseInt(process.env.REQUEST_TIMEOUT_MS, 10) || 10000,
    logLevel: process.env.LOG_LEVEL || 'info',
    nodeEnv: process.env.NODE_ENV || 'production',
  },

  // GCP configuration
  gcp: {
    projectId: process.env.GCP_PROJECT_ID || 'deductlyapp',
    region: process.env.GCP_REGION || 'us-central1',
    
    // Firestore collection following naming convention: {app}_{entity}
    firestore: {
      properties: process.env.FIRESTORE_COLLECTION || 'property_tax_properties',
    },
  },

  // Cache configuration
  cache: {
    ttlDays: parseInt(process.env.CACHE_TTL_DAYS, 10) || 30,
    enableCache: process.env.ENABLE_CACHE !== 'false',
  },

  // Apify configuration for Zillow scraper
  apify: {
    apiKey: process.env.APIFY_API_KEY,
    zillowActorId: 'maxcopell/zillow-detail-scraper',
    timeoutMs: 60000, // 60 seconds
  },
};

/**
 * Validate that required configuration is present
 * @returns {Object} { valid: boolean, missing: string[] }
 */
function validateConfig() {
  const required = [
    // Add required config keys here if needed
  ];

  const missing = required
    .filter(({ value }) => !value)
    .map(({ key }) => key);

  return {
    valid: missing.length === 0,
    missing,
  };
}

module.exports = {
  config,
  validateConfig,
};
