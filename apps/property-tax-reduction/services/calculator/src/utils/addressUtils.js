/**
 * Address Utilities
 * 
 * Helper functions for address normalization and hashing
 * Used for consistent Firestore document IDs
 */

/**
 * Hash an address to create a consistent Firestore document ID
 * Normalizes the address to prevent duplicate records
 * 
 * @param {string} address - Property address
 * @returns {string} Hashed address suitable for Firestore document ID
 */
function hashAddress(address) {
  if (!address || typeof address !== 'string') {
    throw new Error('Invalid address provided for hashing');
  }

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
 * Normalize an address for consistent storage and comparison
 * 
 * @param {string} address - Raw address input
 * @returns {string} Normalized address
 */
function normalizeAddress(address) {
  if (!address || typeof address !== 'string') {
    throw new Error('Invalid address provided for normalization');
  }

  return address
    .trim()
    .replace(/\s+/g, ' ') // Collapse multiple spaces
    .replace(/,\s*/g, ', '); // Standardize comma spacing
}

/**
 * Validate address format
 * 
 * @param {string} address - Address to validate
 * @returns {Object} { valid: boolean, error?: string }
 */
function validateAddress(address) {
  if (!address) {
    return { valid: false, error: 'Address is required' };
  }

  if (typeof address !== 'string') {
    return { valid: false, error: 'Address must be a string' };
  }

  const trimmed = address.trim();
  
  if (trimmed.length === 0) {
    return { valid: false, error: 'Address cannot be empty' };
  }

  if (trimmed.length < 5) {
    return { valid: false, error: 'Address is too short' };
  }

  if (trimmed.length > 500) {
    return { valid: false, error: 'Address is too long' };
  }

  return { valid: true };
}

module.exports = {
  hashAddress,
  normalizeAddress,
  validateAddress,
};

