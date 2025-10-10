/**
 * Phone number formatter utility
 * Formats phone numbers to a consistent format: +998 XX XXX XX XX
 */

/**
 * Formats a phone number to the standard Uzbek format
 * @param {string} phoneNumber - Raw phone number (can be with or without +998)
 * @returns {string} Formatted phone number in format +998 XX XXX XX XX
 */
export const formatPhoneNumber = (phoneNumber) => {
  if (!phoneNumber) return "";

  // Remove all non-digit characters
  const cleanNumber = phoneNumber.replace(/\D/g, "");

  // If number starts with 998, remove it to normalize
  let normalizedNumber = cleanNumber;
  if (normalizedNumber.startsWith("998")) {
    normalizedNumber = normalizedNumber.substring(3);
  }

  // If number is less than 9 digits, return as is
  if (normalizedNumber.length < 9) {
    return phoneNumber;
  }

  // Format as +998 XX XXX XX XX
  const match = normalizedNumber.match(/^(\d{2})(\d{3})(\d{2})(\d{2})$/);
  if (match) {
    return `+998 ${match[1]} ${match[2]} ${match[3]} ${match[4]}`;
  }

  // If doesn't match expected format, return original
  return phoneNumber;
};

/**
 * Formats a phone number for display in tables/lists
 * @param {string} phoneNumber - Raw phone number
 * @returns {string} Formatted phone number for display
 */
export const formatPhoneForDisplay = (phoneNumber) => {
  return formatPhoneNumber(phoneNumber);
};

/**
 * Formats a phone number for input fields (shows placeholder format)
 * @param {string} phoneNumber - Raw phone number
 * @returns {string} Formatted phone number for input
 */
export const formatPhoneForInput = (phoneNumber) => {
  if (!phoneNumber || phoneNumber === "+998") return "+998";
  return formatPhoneNumber(phoneNumber);
};

/**
 * Extracts only digits from a phone number
 * @param {string} phoneNumber - Phone number with any formatting
 * @returns {string} Only digits
 */
export const extractPhoneDigits = (phoneNumber) => {
  if (!phoneNumber) return "";
  return phoneNumber.replace(/\D/g, "");
};

/**
 * Checks if a phone number is valid Uzbek format
 * @param {string} phoneNumber - Phone number to validate
 * @returns {boolean} True if valid Uzbek phone number
 */
export const isValidUzbekPhone = (phoneNumber) => {
  if (!phoneNumber) return false;

  const cleanNumber = extractPhoneDigits(phoneNumber);

  // Uzbek phone numbers should be 12 digits (998 + 9 digits)
  if (cleanNumber.length === 12 && cleanNumber.startsWith("998")) {
    return true;
  }

  // Or 9 digits (without country code)
  if (cleanNumber.length === 9) {
    return true;
  }

  return false;
};

/**
 * Normalizes phone number to standard format for API calls
 * @param {string} phoneNumber - Phone number to normalize
 * @returns {string} Normalized phone number (998XXXXXXXXX)
 */
export const normalizePhoneForAPI = (phoneNumber) => {
  if (!phoneNumber) return "";

  const cleanNumber = extractPhoneDigits(phoneNumber);

  // If already 12 digits and starts with 998, return as is
  if (cleanNumber.length === 12 && cleanNumber.startsWith("998")) {
    return cleanNumber;
  }

  // If 9 digits, add 998 prefix
  if (cleanNumber.length === 9) {
    return `998${cleanNumber}`;
  }

  // If other format, try to normalize
  if (cleanNumber.length >= 9) {
    const last9Digits = cleanNumber.slice(-9);
    return `998${last9Digits}`;
  }

  return cleanNumber;
};

/**
 * Converts phone number to E.164 format for react-phone-number-input
 * @param {string} phoneNumber - Phone number to convert
 * @returns {string} E.164 formatted phone number (+998XXXXXXXXX)
 */
export const convertToE164 = (phoneNumber) => {
  if (!phoneNumber) return "";

  const cleanNumber = extractPhoneDigits(phoneNumber);

  // If already 12 digits and starts with 998, add + prefix
  if (cleanNumber.length === 12 && cleanNumber.startsWith("998")) {
    return `+${cleanNumber}`;
  }

  // If 9 digits, add +998 prefix
  if (cleanNumber.length === 9) {
    return `+998${cleanNumber}`;
  }

  // If other format, try to normalize
  if (cleanNumber.length >= 9) {
    const last9Digits = cleanNumber.slice(-9);
    return `+998${last9Digits}`;
  }

  return phoneNumber;
};
