import process from "node:process";
process.env.TZ = "Pacific/Auckland";

import { describe, expect, it } from "vitest";
import { isOutsideBusinessHours } from "./isOutsideBusinessHours";

describe("isOutsideBusinessHours under a process timezone far from the organizer", () => {
  it("judges a UTC organizer by UTC, not by the process timezone", () => {
    // 2026-06-10T10:00:00Z is Wednesday 10:00 UTC and Wednesday 22:00 in Auckland.
    expect(
      isOutsideBusinessHours({
        slotStartIso: "2026-06-10T10:00:00Z",
        durationMinutes: 30,
        organizerTimeZone: "UTC",
      })
    ).toBe(false);
  });

  it("warns for a UTC organizer outside their own working day", () => {
    expect(
      isOutsideBusinessHours({
        slotStartIso: "2026-06-10T21:00:00Z",
        durationMinutes: 30,
        organizerTimeZone: "UTC",
      })
    ).toBe(true);
  });

  it("keeps the weekday of the organizer timezone", () => {
    // Saturday 09:00 in Auckland is still Friday 21:00 UTC.
    expect(
      isOutsideBusinessHours({
        slotStartIso: "2026-06-12T21:00:00Z",
        durationMinutes: 30,
        organizerTimeZone: "Pacific/Auckland",
      })
    ).toBe(true);
  });
});
