import { prisma } from "@calcom/prisma";
import type { Prisma } from "@calcom/prisma/client";
import type { BusinessHours } from "./types";

const businessHoursSelect = {
  startTime: true,
  endTime: true,
  days: true,
} satisfies Prisma.UserBusinessHoursSelect;

let businessHoursService: BusinessHoursService | null = null;

export class BusinessHoursService {
  async getForUser(userId: number): Promise<BusinessHours | null> {
    return prisma.userBusinessHours.findUnique({
      where: { userId },
      select: businessHoursSelect,
    });
  }

  async upsertForUser(userId: number, businessHours: BusinessHours): Promise<BusinessHours> {
    return prisma.userBusinessHours.upsert({
      where: { userId },
      create: { userId, ...businessHours },
      update: businessHours,
      select: businessHoursSelect,
    });
  }
}

export function getBusinessHoursService(): BusinessHoursService {
  if (!businessHoursService) {
    businessHoursService = new BusinessHoursService();
  }

  return businessHoursService;
}
