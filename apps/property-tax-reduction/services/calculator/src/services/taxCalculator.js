/**
 * Tax Calculator Service
 * 
 * Calculates property tax analysis including:
 * - Tax rate derivation from historical data
 * - Current and reduced tax bill calculations
 * - Potential savings analysis
 * 
 * Handles incomplete tax history (e.g., 2025 assessment without tax paid)
 */

const logger = require('../utils/logger');

/**
 * Calculate complete tax analysis for a property
 * @param {Object} propertyData - Property data from scraper
 * @param {Array} propertyData.taxHistory - Tax history with year, taxPaid, assessedValue
 * @param {number} propertyData.marketEstimate - Current market estimate (zestimate)
 * @returns {Object} Tax analysis with calculations
 */
function calculateTaxAnalysis(propertyData) {
  const { taxHistory, marketEstimate } = propertyData;

  // Validate inputs
  if (!taxHistory || !Array.isArray(taxHistory) || taxHistory.length === 0) {
    throw new Error('No tax history available for calculation.');
  }

  if (!marketEstimate) {
    throw new Error('Market estimate unavailable for calculation.');
  }

  // Step 1: Derive tax rate from most recent complete entry
  const taxRateInfo = deriveTaxRate(taxHistory);
  
  // Step 2: Get current assessment (most recent with assessedValue)
  const assessmentInfo = getCurrentAssessment(taxHistory);
  
  // Step 3: Calculate tax bills
  const currentTaxBill = Math.round(
    (assessmentInfo.currentAssessedValue * taxRateInfo.taxRatePercent) / 100
  );
  
  const reducedTaxBill = Math.round(
    (marketEstimate * taxRateInfo.taxRatePercent) / 100
  );
  
  // Step 4: Calculate savings (positive = potential reduction, negative = no benefit)
  const potentialSavings = currentTaxBill - reducedTaxBill;
  const potentialSavingsPercent = currentTaxBill > 0 
    ? parseFloat(((potentialSavings / currentTaxBill) * 100).toFixed(2))
    : 0;

  const calculations = {
    // Tax rate info
    taxRatePercent: taxRateInfo.taxRatePercent,
    derivedFromYear: taxRateInfo.derivedFromYear,
    
    // Assessment info
    currentAssessedValue: assessmentInfo.currentAssessedValue,
    currentAssessedYear: assessmentInfo.currentAssessedYear,
    marketEstimate,
    
    // Tax calculations
    currentTaxBill,
    reducedTaxBill,
    potentialSavings,
    potentialSavingsPercent,
    
    // Metadata
    calculatedAt: new Date().toISOString(),
    calculationVersion: '1.0',
  };

  logger.info('Tax analysis calculated', {
    taxRatePercent: calculations.taxRatePercent,
    derivedFromYear: calculations.derivedFromYear,
    currentAssessedYear: calculations.currentAssessedYear,
    potentialSavings: calculations.potentialSavings,
    potentialSavingsPercent: calculations.potentialSavingsPercent,
  });

  return calculations;
}

/**
 * Derive tax rate from the most recent complete tax history entry
 * A complete entry has both taxPaid AND assessedValue
 * 
 * @param {Array} taxHistory - Tax history array sorted by year descending
 * @returns {Object} { taxRatePercent, derivedFromYear }
 */
function deriveTaxRate(taxHistory) {
  // Find first entry with both taxPaid and assessedValue
  const completeEntry = taxHistory.find(entry => 
    entry.taxPaid && entry.assessedValue
  );

  if (!completeEntry) {
    throw new Error('No complete tax history available for rate calculation.');
  }

  const taxRatePercent = parseFloat(
    ((completeEntry.taxPaid / completeEntry.assessedValue) * 100).toFixed(4)
  );

  logger.debug('Tax rate derived', {
    year: completeEntry.year,
    taxPaid: completeEntry.taxPaid,
    assessedValue: completeEntry.assessedValue,
    taxRatePercent,
  });

  return {
    taxRatePercent,
    derivedFromYear: completeEntry.year,
  };
}

/**
 * Get the most recent assessed value from tax history
 * Uses the first entry that has an assessedValue (even if taxPaid is null)
 * 
 * @param {Array} taxHistory - Tax history array sorted by year descending
 * @returns {Object} { currentAssessedValue, currentAssessedYear }
 */
function getCurrentAssessment(taxHistory) {
  // Find first entry with assessedValue
  const recentAssessment = taxHistory.find(entry => entry.assessedValue);

  if (!recentAssessment) {
    throw new Error('No assessed value found in tax history.');
  }

  logger.debug('Current assessment found', {
    year: recentAssessment.year,
    assessedValue: recentAssessment.assessedValue,
    hasTaxPaid: !!recentAssessment.taxPaid,
  });

  return {
    currentAssessedValue: recentAssessment.assessedValue,
    currentAssessedYear: recentAssessment.year,
  };
}

module.exports = {
  calculateTaxAnalysis,
  deriveTaxRate,
  getCurrentAssessment,
};

