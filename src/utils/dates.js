import { 
  addMonths, 
  addDays, 
  format, 
  parseISO, 
  isAfter, 
  isBefore, 
  startOfMonth, 
  endOfMonth,
  differenceInDays,
  startOfDay,
  endOfDay
} from 'date-fns';

/**
 * Format a date to a readable string
 * @param {string|Date} date - Date to format
 * @param {string} formatStr - Format string (default: 'MMM dd, yyyy')
 * @returns {string} Formatted date
 */
export const formatDate = (date, formatStr = 'MMM dd, yyyy') => {
  if (!date) return '';
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, formatStr);
};

/**
 * Format a date to show only month and year
 * @param {string|Date} date - Date to format
 * @returns {string} Formatted date (e.g., "Jan 2025")
 */
export const formatMonthYear = (date) => {
  return formatDate(date, 'MMM yyyy');
};

/**
 * Get the next occurrence of a date based on recurrence pattern
 * @param {Object} recurrence - Recurrence object with type, interval, and day
 * @param {Date} fromDate - Starting date
 * @returns {Date} Next occurrence date
 */
export const getNextOccurrence = (recurrence, fromDate) => {
  if (!recurrence || !fromDate) return null;
  
  const { type, interval, day } = recurrence;
  let nextDate = new Date(fromDate);
  
  switch (type) {
    case 'monthly':
      nextDate = addMonths(nextDate, interval);
      nextDate.setDate(day);
      break;
    case 'annual':
      nextDate = addMonths(nextDate, interval * 12);
      nextDate.setDate(day);
      break;
    case 'custom':
      nextDate = addMonths(nextDate, interval);
      nextDate.setDate(day);
      break;
    default:
      return null;
  }
  
  return nextDate;
};

/**
 * Check if a date is within a threshold of days from today
 * @param {string|Date} date - Date to check
 * @param {number} thresholdDays - Number of days threshold
 * @returns {boolean} True if within threshold
 */
export const isWithinThreshold = (date, thresholdDays) => {
  if (!date) return false;
  
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  const today = startOfDay(new Date());
  const thresholdDate = addDays(today, thresholdDays);
  
  return isAfter(dateObj, today) && isBefore(dateObj, thresholdDate);
};

/**
 * Get all dates in a month range
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @returns {Array} Array of dates
 */
export const getDatesInRange = (startDate, endDate) => {
  const dates = [];
  let currentDate = startOfDay(startDate);
  const end = endOfDay(endDate);
  
  while (isBefore(currentDate, end)) {
    dates.push(new Date(currentDate));
    currentDate = addDays(currentDate, 1);
  }
  
  return dates;
};

/**
 * Get the number of days until a date
 * @param {string|Date} date - Target date
 * @returns {number} Days until date
 */
export const getDaysUntil = (date) => {
  if (!date) return 0;
  
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  const today = startOfDay(new Date());
  
  return differenceInDays(dateObj, today);
};

/**
 * Check if a date is overdue
 * @param {string|Date} date - Date to check
 * @returns {boolean} True if overdue
 */
export const isOverdue = (date) => {
  if (!date) return false;
  
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  const today = startOfDay(new Date());
  
  return isBefore(dateObj, today);
};
