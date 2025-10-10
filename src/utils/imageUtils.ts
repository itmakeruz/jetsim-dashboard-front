/**
 * Utility functions for handling image URLs
 */

/**
 * Get the storage base URL from environment variables
 * @returns {string} The storage base URL
 */
export const getStorageBaseUrl = () => {
  const storageUrl = import.meta.env.VITE_STORAGE_BASE_URL;
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  if (storageUrl) {
    return storageUrl;
  }

  // If using API URL, remove /api suffix if present
  if (apiUrl) {
    return apiUrl.replace(/\/api$/, "");
  }

  return "";
};

/**
 * Get full image URL from storage path
 * @param {string} imagePath - The image path from API response
 * @returns {string} Full image URL
 */
export const getImageUrl = (imagePath) => {
  if (!imagePath) return "";

  // If it's already a full URL, return as is
  if (imagePath.startsWith("http")) {
    return imagePath;
  }

  // Remove leading slash if present
  const cleanPath = imagePath.startsWith("/") ? imagePath.slice(1) : imagePath;

  // Construct full URL
  const baseUrl = getStorageBaseUrl();
  return `${baseUrl}/storage/${cleanPath}`;
};

/**
 * Get passport image URL specifically
 * @param {string} passportPath - The passport image path
 * @returns {string} Full passport image URL
 */
export const getPassportImageUrl = (passportPath) => {
  return getImageUrl(passportPath);
};

/**
 * Get news photo URL specifically
 * @param {string} photoPath - The news photo path
 * @returns {string} Full news photo URL
 */
export const getNewsPhotoUrl = (photoPath) => {
  return getImageUrl(photoPath);
};
