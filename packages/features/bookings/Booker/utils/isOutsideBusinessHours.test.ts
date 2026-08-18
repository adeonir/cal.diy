import { describe, expect, it } from "vitest";
import { isOutsideBusinessHours } from "./isOutsideBusinessHours";

describe("isOutsideBusinessHours", () => {
  it("should return false for a weekday slot within business hours", () => {
    // Wednesday 10:00 in London
    const result = isOutsideBusinessHours({
      timeslot: "2024-02-07T10:00:00.000Z",
      timeZone: "Europe/London",
    });

    expect(result).toBe(false);
  });

  it("should return true for a weekday slot before business hours", () => {
    // Wednesday 08:30 in London
    const result = isOutsideBusinessHours({
      timeslot: "2024-02-07T08:30:00.000Z",
      timeZone: "Europe/London",
    });

    expect(result).toBe(true);
  });

  it("should return true for a weekday slot at the end of business hours", () => {
    // Wednesday 17:00 in London
    const result = isOutsideBusinessHours({
      timeslot: "2024-02-07T17:00:00.000Z",
      timeZone: "Europe/London",
    });

    expect(result).toBe(true);
  });

  it("should return true for a weekend slot inside business hours", () => {
    // Saturday 11:00 in London
    const result = isOutsideBusinessHours({
      timeslot: "2024-02-10T11:00:00.000Z",
      timeZone: "Europe/London",
    });

    expect(result).toBe(true);
  });

  it("should evaluate the slot in the booker timezone", () => {
    const timeslot = "2024-02-07T22:00:00.000Z";

    // 22:00 in London, but 09:00 next day in Sydney
    expect(isOutsideBusinessHours({ timeslot, timeZone: "Europe/London" })).toBe(true);
    expect(isOutsideBusinessHours({ timeslot, timeZone: "Australia/Sydney" })).toBe(false);
  });

  it("should return false when no timeslot is selected", () => {
    expect(isOutsideBusinessHours({ timeslot: null, timeZone: "Europe/London" })).toBe(false);
  });

  it("should return false when the timeslot is not a valid date", () => {
    expect(isOutsideBusinessHours({ timeslot: "not-a-date", timeZone: "Europe/London" })).toBe(false);
  });
});
