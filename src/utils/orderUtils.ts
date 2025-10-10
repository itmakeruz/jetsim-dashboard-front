import formatNumber from "./formatNumber";
// Utility functions for orders

/**
 * Get payment methods from payments array
 * @param {Array} payments - Array of payment objects
 * @returns {string} - Comma-separated payment method names or "-" if no payments
 */
export const getPaymentMethods = (payments) => {
  if (!payments || payments.length === 0) return "-";
  return payments.map((payment) => payment.payment_type?.name).join(", ");
};

/**
 * Get total payment amount from payments array
 * @param {Array} payments - Array of payment objects
 * @returns {string} - Formatted total amount or "0" if no payments
 */
export const getTotalPayment = (payments) => {
  if (!payments || payments.length === 0) return "0";

  const total = payments
    .map((payment) => formatNumber(+payment.amount))
    .join(", ");
  return total;
};
