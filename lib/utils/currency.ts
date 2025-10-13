/**
 * Utility functions for currency and status formatting
 */

export function formatCurrency(amount: number, currency: string): string {
  // Fallback to USD if currency is invalid or undefined
  const validCurrency = currency && currency.length === 3 ? currency : "USD";

  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: validCurrency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch (error) {
    // Fallback to basic formatting if currency is still invalid
    console.log(error);
    return `${validCurrency} ${amount.toLocaleString()}`;
  }
}

export function formatCurrencyWithDecimals(
  amount: number,
  currency: string,
): string {
  // Fallback to USD if currency is invalid or undefined
  const validCurrency = currency && currency.length === 3 ? currency : "USD";

  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: validCurrency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch (error) {
    // Fallback to basic formatting if currency is still invalid
    console.log(error);
    return `${validCurrency} ${amount.toFixed(2)}`;
  }
}

export function isValidCurrency(currency: string): boolean {
  if (!currency || currency.length !== 3) return false;

  try {
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    });
    return true;
  } catch {
    return false;
  }
}

/**
 * Format status text by replacing underscores with spaces and capitalizing words
 */
export function formatStatusText(status: string | undefined): string {
  if (!status) return "Unknown";
  return status.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
}

/**
 * Format purpose text by replacing underscores with spaces and capitalizing words
 */
export function formatPurpose(purpose: string | undefined): string {
  if (!purpose) return "Not specified";
  return purpose.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
}
