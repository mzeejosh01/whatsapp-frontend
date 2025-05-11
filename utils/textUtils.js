/**
 * Truncates text to a specified length with an ellipsis
 * @param {string} text - The text to truncate
 * @param {number} maxLength - The maximum length allowed
 * @returns {string} Truncated text with ellipsis if needed
 */
export const truncateText = (text, maxLength = 100) => {
  if (!text || text.length <= maxLength) {
    return text;
  }

  return text.substring(0, maxLength) + "...";
};

/**
 * Extracts promises or commitments from text
 * @param {string} text - The text to analyze
 * @returns {string[]} An array of extracted promises
 */
export const extractPromises = (text) => {
  const promiseIndicators = [
    "I will",
    "I'll",
    "I promise",
    "I commit",
    "I'm going to",
    "I am going to",
    "I can",
    "I should",
    "I must",
    "I need to",
  ];

  const sentences = text.replace(/([.?!])\s*(?=[A-Z])/g, "$1|").split("|");

  return sentences.filter((sentence) =>
    promiseIndicators.some((indicator) =>
      sentence.toLowerCase().includes(indicator.toLowerCase())
    )
  );
};

/**
 * Detects if text contains dates or time references
 * @param {string} text - The text to analyze
 * @returns {boolean} True if text contains date references
 */
export const containsDateReferences = (text) => {
  const dateKeywords = [
    "today",
    "tomorrow",
    "yesterday",
    "next week",
    "last week",
    "this week",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
    "january",
    "february",
    "march",
    "april",
    "may",
    "june",
    "july",
    "august",
    "september",
    "october",
    "november",
    "december",
  ];

  // Check for date keywords
  if (dateKeywords.some((keyword) => text.toLowerCase().includes(keyword))) {
    return true;
  }

  // Check for date patterns like MM/DD/YYYY
  const datePattern =
    /\b(0?[1-9]|1[0-2])[\/\-](0?[1-9]|[12]\d|3[01])[\/\-](\d{4}|\d{2})\b/;
  if (datePattern.test(text)) {
    return true;
  }

  return false;
};

/**
 * Extracts potential monetary values from text
 * @param {string} text - The text to analyze
 * @returns {object[]} Array of extracted monetary values with amounts and currency
 */
export const extractMonetaryValues = (text) => {
  const moneyRegex =
    /\$\d+(\.\d{1,2})?|\d+(\.\d{1,2})?\s?(dollars|USD|EUR|€|£|¥)/gi;
  const matches = text.match(moneyRegex) || [];

  return matches.map((match) => {
    let amount, currency;

    if (match.startsWith("$")) {
      amount = parseFloat(match.substring(1).replace(/,/g, ""));
      currency = "USD";
    } else if (match.includes("dollars") || match.includes("USD")) {
      amount = parseFloat(
        match
          .replace(/dollars|USD/gi, "")
          .trim()
          .replace(/,/g, "")
      );
      currency = "USD";
    } else if (match.includes("€")) {
      amount = parseFloat(match.replace(/€/g, "").trim().replace(/,/g, ""));
      currency = "EUR";
    } else if (match.includes("£")) {
      amount = parseFloat(match.replace(/£/g, "").trim().replace(/,/g, ""));
      currency = "GBP";
    } else if (match.includes("¥")) {
      amount = parseFloat(match.replace(/¥/g, "").trim().replace(/,/g, ""));
      currency = "JPY";
    } else {
      // Default case
      amount = parseFloat(match.replace(/,/g, ""));
      currency = "USD";
    }

    return { amount, currency };
  });
};
