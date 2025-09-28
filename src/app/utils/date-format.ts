export function formatDate(date: Date): string {
  return date.toLocaleString();
}

/**
 * Checks if the given date is in the future compared to now.
 * @param date Date to check
 * @returns true if date is in the future, false otherwise
 */
export function isFuture(date: Date): boolean {
  return date.getTime() > Date.now();
}
