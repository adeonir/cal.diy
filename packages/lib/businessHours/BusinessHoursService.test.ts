import { beforeEach, describe, expect, it, vi } from "vitest";

const findUnique = vi.fn();
const upsert = vi.fn();

vi.mock("@calcom/prisma", () => ({
  prisma: {
    userBusinessHours: {
      findUnique: (...args: unknown[]) => findUnique(...args),
      upsert: (...args: unknown[]) => upsert(...args),
    },
  },
}));

import { BusinessHoursService } from "./BusinessHoursService";

const businessHours = { startTime: 540, endTime: 1020, days: [1, 2, 3, 4, 5] };

describe("BusinessHoursService", () => {
  beforeEach(() => {
    findUnique.mockReset();
    upsert.mockReset();
  });

  it("returns null for a user who never configured business hours", async () => {
    findUnique.mockResolvedValue(null);

    await expect(new BusinessHoursService().getForUser(7)).resolves.toBeNull();
    expect(findUnique).toHaveBeenCalledWith(expect.objectContaining({ where: { userId: 7 } }));
  });

  it("returns the stored hours", async () => {
    findUnique.mockResolvedValue(businessHours);

    await expect(new BusinessHoursService().getForUser(7)).resolves.toEqual(businessHours);
  });

  it("creates the row on the first write and updates it afterwards", async () => {
    upsert.mockResolvedValue(businessHours);

    await new BusinessHoursService().upsertForUser(7, businessHours);

    expect(upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { userId: 7 },
        create: { userId: 7, ...businessHours },
        update: businessHours,
      })
    );
  });
});
