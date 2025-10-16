import dayjs, { Dayjs } from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import duration from 'dayjs/plugin/duration';
import isBetween from 'dayjs/plugin/isBetween';
import customParseFormat from 'dayjs/plugin/customParseFormat';

// Extend dayjs with plugins
dayjs.extend(relativeTime);
dayjs.extend(localizedFormat);
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(duration);
dayjs.extend(isBetween);
dayjs.extend(customParseFormat);

// Common date format patterns
export const DATE_FORMATS = {
  SHORT: 'MM/DD/YYYY',
  MEDIUM: 'MMM D, YYYY',
  LONG: 'MMMM D, YYYY',
  FULL: 'dddd, MMMM D, YYYY',
  TIME: 'h:mm A',
  DATETIME: 'MMM D, YYYY h:mm A',
  ISO: 'YYYY-MM-DD',
  ISO_DATETIME: 'YYYY-MM-DDTHH:mm:ss',
} as const;

/**
 * Format a date with the specified format
 */
export function formatDate(
  date: string | Date | Dayjs,
  format: string = DATE_FORMATS.MEDIUM
): string {
  return dayjs(date).format(format);
}

/**
 * Get relative time from now (e.g., "2 hours ago")
 */
export function getRelativeTime(date: string | Date | Dayjs): string {
  return dayjs(date).fromNow();
}

/**
 * Get relative time to a specific date
 */
export function getRelativeTimeTo(
  date: string | Date | Dayjs,
  baseDate: string | Date | Dayjs
): string {
  return dayjs(date).from(dayjs(baseDate));
}

/**
 * Check if a date is in the past
 */
export function isPast(date: string | Date | Dayjs): boolean {
  return dayjs(date).isBefore(dayjs());
}

/**
 * Check if a date is in the future
 */
export function isFuture(date: string | Date | Dayjs): boolean {
  return dayjs(date).isAfter(dayjs());
}

/**
 * Check if a date is today
 */
export function isToday(date: string | Date | Dayjs): boolean {
  return dayjs(date).isSame(dayjs(), 'day');
}

/**
 * Check if a date is between two dates
 */
export function isBetweenDates(
  date: string | Date | Dayjs,
  startDate: string | Date | Dayjs,
  endDate: string | Date | Dayjs,
  inclusivity: '()' | '[]' | '(]' | '[)' = '[]'
): boolean {
  return dayjs(date).isBetween(startDate, endDate, null, inclusivity);
}

/**
 * Get the difference between two dates in a specific unit
 */
export function getDateDifference(
  date1: string | Date | Dayjs,
  date2: string | Date | Dayjs,
  unit: 'day' | 'week' | 'month' | 'year' | 'hour' | 'minute' | 'second' = 'day'
): number {
  return dayjs(date1).diff(dayjs(date2), unit);
}

/**
 * Add time to a date
 */
export function addTime(
  date: string | Date | Dayjs,
  amount: number,
  unit: 'day' | 'week' | 'month' | 'year' | 'hour' | 'minute' | 'second'
): Dayjs {
  return dayjs(date).add(amount, unit);
}

/**
 * Subtract time from a date
 */
export function subtractTime(
  date: string | Date | Dayjs,
  amount: number,
  unit: 'day' | 'week' | 'month' | 'year' | 'hour' | 'minute' | 'second'
): Dayjs {
  return dayjs(date).subtract(amount, unit);
}

/**
 * Get start of a time unit
 */
export function startOf(
  date: string | Date | Dayjs,
  unit: 'day' | 'week' | 'month' | 'year' | 'hour' | 'minute'
): Dayjs {
  return dayjs(date).startOf(unit);
}

/**
 * Get end of a time unit
 */
export function endOf(
  date: string | Date | Dayjs,
  unit: 'day' | 'week' | 'month' | 'year' | 'hour' | 'minute'
): Dayjs {
  return dayjs(date).endOf(unit);
}

/**
 * Convert date to UTC
 */
export function toUTC(date: string | Date | Dayjs): Dayjs {
  return dayjs(date).utc();
}

/**
 * Convert date to a specific timezone
 */
export function toTimezone(
  date: string | Date | Dayjs,
  timezone: string
): Dayjs {
  return dayjs(date).tz(timezone);
}

/**
 * Get duration between two dates
 */
export function getDuration(
  startDate: string | Date | Dayjs,
  endDate: string | Date | Dayjs
): {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  humanReadable: string;
} {
  const start = dayjs(startDate);
  const end = dayjs(endDate);
  const diff = dayjs.duration(end.diff(start));

  return {
    days: Math.floor(diff.asDays()),
    hours: Math.floor(diff.asHours()),
    minutes: Math.floor(diff.asMinutes()),
    seconds: Math.floor(diff.asSeconds()),
    humanReadable: diff.humanize(),
  };
}

/**
 * Parse a date string with a custom format
 */
export function parseDate(
  dateString: string,
  format: string
): Dayjs | null {
  const parsed = dayjs(dateString, format);
  return parsed.isValid() ? parsed : null;
}

/**
 * Check if a date string is valid
 */
export function isValidDate(date: string | Date | Dayjs): boolean {
  return dayjs(date).isValid();
}

/**
 * Get an array of dates between two dates
 */
export function getDateRange(
  startDate: string | Date | Dayjs,
  endDate: string | Date | Dayjs
): Dayjs[] {
  const dates: Dayjs[] = [];
  let current = dayjs(startDate);
  const end = dayjs(endDate);

  while (current.isBefore(end) || current.isSame(end)) {
    dates.push(current);
    current = current.add(1, 'day');
  }

  return dates;
}

/**
 * Format a date range as a string
 */
export function formatDateRange(
  startDate: string | Date | Dayjs,
  endDate: string | Date | Dayjs,
  format: string = DATE_FORMATS.MEDIUM
): string {
  return `${dayjs(startDate).format(format)} - ${dayjs(endDate).format(format)}`;
}

export default dayjs;