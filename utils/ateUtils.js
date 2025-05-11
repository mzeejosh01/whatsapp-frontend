import {
  format,
  formatDistanceToNow,
  parseISO,
  isToday,
  isTomorrow,
  isYesterday,
} from "date-fns";

/**
 * Formats a date with a friendly description when appropriate
 * @param {Date|string} date - The date to format
 * @param {string} formatString - The format string to use (defaults to 'MMM d, yyyy')
 * @returns {string} The formatted date string
 */
export const formatDateFriendly = (date, formatString = "MMM d, yyyy") => {
  const dateObj = typeof date === "string" ? parseISO(date) : date;

  if (isToday(dateObj)) {
    return `Today at ${format(dateObj, "h:mm a")}`;
  } else if (isTomorrow(dateObj)) {
    return `Tomorrow at ${format(dateObj, "h:mm a")}`;
  } else if (isYesterday(dateObj)) {
    return `Yesterday at ${format(dateObj, "h:mm a")}`;
  } else {
    return format(dateObj, formatString);
  }
};

/**
 * Gets time elapsed since a date in a human-readable format
 * @param {Date|string} date - The date to calculate from
 * @returns {string} Human-readable time elapsed
 */
export const getTimeElapsed = (date) => {
  const dateObj = typeof date === "string" ? parseISO(date) : date;
  return formatDistanceToNow(dateObj, { addSuffix: true });
};

/**
 * Parses a date string from a variety of formats
 * @param {string} dateString - The date string to parse
 * @returns {Date|null} A Date object or null if unable to parse
 */
export const parseDate = (dateString) => {
  // Try different parsing methods
  try {
    // First try as ISO string
    return parseISO(dateString);
  } catch (error) {
    // Try natural language parsing
    const today = new Date();

    if (dateString.toLowerCase().includes("tomorrow")) {
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);
      return tomorrow;
    } else if (dateString.toLowerCase().includes("next week")) {
      const nextWeek = new Date(today);
      nextWeek.setDate(today.getDate() + 7);
      return nextWeek;
    }

    // If all else fails, return null
    return null;
  }
};
