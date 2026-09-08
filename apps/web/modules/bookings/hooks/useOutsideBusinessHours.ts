import type { BookerEvent } from "@calcom/features/bookings/types";
import { isOutsideBusinessHours } from "@calcom/lib/businessHours";
import { useCallback } from "react";

/**
 * Returns a predicate telling whether a candidate slot falls outside the organizer's business hours.
 *
 * A predicate rather than a boolean: the slot click handler decides whether to skip the confirm
 * step before the store has the new slot, so a boolean derived from the store would be one render
 * behind and the first out-of-hours slot would still book in one click.
 */
export const useOutsideBusinessHours = (
  event?: Pick<BookerEvent, "length" | "organizerBusinessHours"> | null
) => {
  const organizerBusinessHours = event?.organizerBusinessHours;
  const length = event?.length;

  return useCallback(
    (slotStartIso?: string | null): boolean => {
      if (!slotStartIso || !organizerBusinessHours || !length) {
        return false;
      }

      return isOutsideBusinessHours({
        slotStartIso,
        durationMinutes: length,
        organizerTimeZone: organizerBusinessHours.timeZone,
        businessHours: organizerBusinessHours.businessHours,
      });
    },
    [organizerBusinessHours, length]
  );
};
