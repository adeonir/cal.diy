import dayjs from "@calcom/dayjs";

// Mirrors the default availability schedule (Mon-Fri, 9:00 to 17:00) used across the app
export const BUSINESS_HOURS_START_HOUR = 9;
export const BUSINESS_HOURS_END_HOUR = 17;

const SUNDAY = 0;
const SATURDAY = 6;

/**
 * Checks whether a selected timeslot starts outside typical business hours,
 * evaluated in the booker's own timezone.
 * Used to warn the booker, never to block the booking.
 * @returns boolean - true when the slot starts on a weekend or outside 9:00-17:00.
 */
export const isOutsideBusinessHours = ({
  timeslot,
  timeZone,
}: {
  timeslot: string | null;
  timeZone: string;
}) => {
  if (!timeslot) return false;

  const parsedSlot = dayjs(timeslot);
  // An unparseable slot shouldn't surface a misleading warning
  if (!parsedSlot.isValid()) return false;

  const slotStart = parsedSlot.tz(timeZone);
  const dayOfWeek = slotStart.day();
  if (dayOfWeek === SATURDAY || dayOfWeek === SUNDAY) return true;

  const hourOfDay = slotStart.hour() + slotStart.minute() / 60;

  return hourOfDay < BUSINESS_HOURS_START_HOUR || hourOfDay >= BUSINESS_HOURS_END_HOUR;
};
