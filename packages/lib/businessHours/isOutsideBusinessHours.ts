import dayjs from "@calcom/dayjs";
import type { BusinessHours } from "./types";
import { DEFAULT_BUSINESS_HOURS } from "./types";

type IsOutsideBusinessHoursArgs = {
  /** UTC ISO string of the slot start, as held in the booker store */
  slotStartIso: string;
  /** Event length in minutes */
  durationMinutes: number;
  /** IANA timezone of the organizer */
  organizerTimeZone: string;
  businessHours?: BusinessHours | null;
};

/**
 * Tells whether a slot falls outside the organizer's business hours.
 *
 * The slot is converted to the organizer timezone before anything else, because both the weekday
 * and the time of day depend on it: 23:00 UTC on a Friday is already Saturday in Auckland.
 *
 * The comparison runs on wall-clock minutes rather than on two dayjs instants. Building the window
 * with startOf("day") would read the process timezone instead of the organizer's, and adding
 * minutes to local midnight shifts the window by an hour on a DST transition day.
 */
export function isOutsideBusinessHours({
  slotStartIso,
  durationMinutes,
  organizerTimeZone,
  businessHours,
}: IsOutsideBusinessHoursArgs): boolean {
  const { startTime, endTime, days } = businessHours ?? DEFAULT_BUSINESS_HOURS;

  // Ranges crossing midnight are rejected when the setting is written. Bad data must not warn on
  // every slot. TODO(business-hours): support crossing midnight with a per-weekday shape.
  if (endTime <= startTime) {
    return false;
  }

  const slot = dayjs.utc(slotStartIso);

  if (!slot.isValid()) {
    return false;
  }

  const start = slot.tz(organizerTimeZone);

  if (!days.includes(start.day())) {
    return true;
  }

  const slotStartMinutes = start.hour() * 60 + start.minute();
  const slotEndMinutes = slotStartMinutes + durationMinutes;

  return slotStartMinutes < startTime || slotStartMinutes >= endTime || slotEndMinutes > endTime;
}
