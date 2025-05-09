/**
 * Helper functions for working with order statuses
 */

// Valid order statuses
export const ORDER_STATUSES = ['Pending', 'In Progress', 'Delivered'];

/**
 * Checks if a status is valid
 * @param {string} status - The status to check
 * @returns {boolean} - Whether the status is valid
 */
export const isValidStatus = (status) => {
  return ORDER_STATUSES.includes(status);
};

/**
 * Gets the next status in the workflow
 * @param {string} currentStatus - The current status
 * @returns {string|null} - The next status, or null if at the end
 */
export const getNextStatus = (currentStatus) => {
  const currentIndex = ORDER_STATUSES.indexOf(currentStatus);
  
  if (currentIndex === -1 || currentIndex === ORDER_STATUSES.length - 1) {
    return null;
  }
  
  return ORDER_STATUSES[currentIndex + 1];
};

/**
 * Gets the previous status in the workflow
 * @param {string} currentStatus - The current status
 * @returns {string|null} - The previous status, or null if at the beginning
 */
export const getPrevStatus = (currentStatus) => {
  const currentIndex = ORDER_STATUSES.indexOf(currentStatus);
  
  if (currentIndex <= 0) {
    return null;
  }
  
  return ORDER_STATUSES[currentIndex - 1];
};
