/**
 * Structured logging utility for Cloud Functions
 * 
 * Outputs JSON logs that integrate with Google Cloud Logging
 */

const LOG_LEVELS = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

const currentLevel = LOG_LEVELS[process.env.LOG_LEVEL] || LOG_LEVELS.info;

/**
 * Create a structured log entry
 * @param {string} severity - Log level (DEBUG, INFO, WARNING, ERROR)
 * @param {string} message - Log message
 * @param {Object} data - Additional data to include
 */
function log(severity, message, data = {}) {
  const entry = {
    severity,
    message,
    timestamp: new Date().toISOString(),
    ...data,
  };

  // In production, output as JSON for Cloud Logging
  if (process.env.NODE_ENV === 'production') {
    console.log(JSON.stringify(entry));
  } else {
    // In development, output human-readable format
    const dataStr = Object.keys(data).length > 0 ? ` ${JSON.stringify(data)}` : '';
    console.log(`[${severity}] ${message}${dataStr}`);
  }
}

const logger = {
  debug: (message, data) => {
    if (currentLevel <= LOG_LEVELS.debug) {
      log('DEBUG', message, data);
    }
  },

  info: (message, data) => {
    if (currentLevel <= LOG_LEVELS.info) {
      log('INFO', message, data);
    }
  },

  warn: (message, data) => {
    if (currentLevel <= LOG_LEVELS.warn) {
      log('WARNING', message, data);
    }
  },

  error: (message, data) => {
    if (currentLevel <= LOG_LEVELS.error) {
      log('ERROR', message, data);
    }
  },
};

module.exports = logger;




