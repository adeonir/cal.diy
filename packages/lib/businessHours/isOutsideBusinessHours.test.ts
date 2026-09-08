import { describe, expect, it } from "vitest";
import { isOutsideBusinessHours } from "./isOutsideBusinessHours";

const NEW_YORK = "America/New_York";

// 2026-06-10 is a Wednesday. UTC-4 in New York, so 13:00Z is 09:00 local.
const wednesday = (utcTime: string) => `2026-06-10T${utcTime}Z`;

describe("isOutsideBusinessHours", () => {
  it("returns false for a slot inside the default hours", () => {
    expect(
      isOutsideBusinessHours({
        slotStartIso: wednesday("18:00:00"),
        durationMinutes: 30,
        organizerTimeZone: NEW_YORK,
      })
    ).toBe(false);
  });

  it("treats the start boundary as inside", () => {
    expect(
      isOutsideBusinessHours({
        slotStartIso: wednesday("13:00:00"),
        durationMinutes: 30,
        organizerTimeZone: NEW_YORK,
      })
    ).toBe(false);
  });

  it("treats the end boundary as outside for a slot starting there", () => {
    expect(
      isOutsideBusinessHours({
        slotStartIso: wednesday("21:00:00"),
        durationMinutes: 30,
        organizerTimeZone: NEW_YORK,
      })
    ).toBe(true);
  });

  it("allows a slot that ends exactly at the closing time", () => {
    expect(
      isOutsideBusinessHours({
        slotStartIso: wednesday("20:30:00"),
        durationMinutes: 30,
        organizerTimeZone: NEW_YORK,
      })
    ).toBe(false);
  });

  it("warns when the slot overruns the closing time", () => {
    expect(
      isOutsideBusinessHours({
        slotStartIso: wednesday("20:30:00"),
        durationMinutes: 60,
        organizerTimeZone: NEW_YORK,
      })
    ).toBe(true);
  });

  it("warns on a weekday that is not active", () => {
    expect(
      isOutsideBusinessHours({
        slotStartIso: "2026-06-13T18:00:00Z",
        durationMinutes: 30,
        organizerTimeZone: NEW_YORK,
      })
    ).toBe(true);
  });

  it("does not warn on a weekend for a weekend-only host", () => {
    expect(
      isOutsideBusinessHours({
        slotStartIso: "2026-06-13T18:00:00Z",
        durationMinutes: 30,
        organizerTimeZone: NEW_YORK,
        businessHours: { startTime: 9 * 60, endTime: 17 * 60, days: [0, 6] },
      })
    ).toBe(false);
  });

  it("judges the same instant by the organizer timezone", () => {
    // 2026-06-12T23:00:00Z is Saturday 11:00 in Auckland and Friday 19:00 in New York.
    const instant = "2026-06-12T23:00:00Z";

    expect(
      isOutsideBusinessHours({
        slotStartIso: instant,
        durationMinutes: 30,
        organizerTimeZone: "Pacific/Auckland",
      })
    ).toBe(true);

    expect(
      isOutsideBusinessHours({
        slotStartIso: instant,
        durationMinutes: 30,
        organizerTimeZone: NEW_YORK,
      })
    ).toBe(true);

    // Same Auckland weekday problem, but inside New York hours: 17:00Z is Friday 13:00 in New York
    // and Saturday 05:00 in Auckland.
    expect(
      isOutsideBusinessHours({
        slotStartIso: "2026-06-12T17:00:00Z",
        durationMinutes: 30,
        organizerTimeZone: NEW_YORK,
      })
    ).toBe(false);

    expect(
      isOutsideBusinessHours({
        slotStartIso: "2026-06-12T17:00:00Z",
        durationMinutes: 30,
        organizerTimeZone: "Pacific/Auckland",
      })
    ).toBe(true);
  });

  it("falls back to the default hours when none are configured", () => {
    const args = {
      slotStartIso: wednesday("22:00:00"),
      durationMinutes: 30,
      organizerTimeZone: NEW_YORK,
    };

    expect(isOutsideBusinessHours({ ...args, businessHours: null })).toBe(true);
    expect(isOutsideBusinessHours({ ...args, businessHours: undefined })).toBe(true);
    expect(
      isOutsideBusinessHours({
        ...args,
        businessHours: { startTime: 9 * 60, endTime: 17 * 60, days: [1, 2, 3, 4, 5] },
      })
    ).toBe(true);
  });

  it("keeps the window on the local clock across a DST transition", () => {
    // 2026-03-08 is the US spring-forward Sunday. 13:00Z is 09:00 in New York on EDT.
    expect(
      isOutsideBusinessHours({
        slotStartIso: "2026-03-08T13:00:00Z",
        durationMinutes: 60,
        organizerTimeZone: NEW_YORK,
        businessHours: { startTime: 9 * 60, endTime: 17 * 60, days: [0] },
      })
    ).toBe(false);
  });

  it("never warns when the range is inverted", () => {
    const businessHours = { startTime: 22 * 60, endTime: 6 * 60, days: [1, 2, 3, 4, 5] };

    expect(
      isOutsideBusinessHours({
        slotStartIso: wednesday("03:00:00"),
        durationMinutes: 30,
        organizerTimeZone: NEW_YORK,
        businessHours,
      })
    ).toBe(false);
  });

  it("warns on every slot when no weekday is active", () => {
    expect(
      isOutsideBusinessHours({
        slotStartIso: wednesday("18:00:00"),
        durationMinutes: 30,
        organizerTimeZone: NEW_YORK,
        businessHours: { startTime: 9 * 60, endTime: 17 * 60, days: [] },
      })
    ).toBe(true);
  });

  it("never warns on an unparseable slot", () => {
    expect(
      isOutsideBusinessHours({
        slotStartIso: "not-a-date",
        durationMinutes: 30,
        organizerTimeZone: NEW_YORK,
      })
    ).toBe(false);
  });
});
