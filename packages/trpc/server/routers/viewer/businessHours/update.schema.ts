import { MINUTES_IN_DAY } from "@calcom/lib/availability";
import { z } from "zod";

export const ZUpdateBusinessHoursSchema = z
  .object({
    startTime: z
      .number()
      .int()
      .min(0)
      .max(MINUTES_IN_DAY - 1),
    endTime: z.number().int().min(1).max(MINUTES_IN_DAY),
    days: z.array(z.number().int().min(0).max(6)).min(1).max(7),
  })
  .refine((value) => value.endTime > value.startTime, {
    message: "end_time_must_be_after_start_time",
    path: ["endTime"],
  });

export type TUpdateBusinessHoursSchema = z.infer<typeof ZUpdateBusinessHoursSchema>;
