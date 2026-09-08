import { getBusinessHoursService } from "@calcom/lib/businessHours/BusinessHoursService";
import type { TrpcSessionUser } from "@calcom/trpc/server/types";
import type { TUpdateBusinessHoursSchema } from "./update.schema";

type UpdateOptions = {
  ctx: {
    user: NonNullable<TrpcSessionUser>;
  };
  input: TUpdateBusinessHoursSchema;
};

export async function updateHandler({ ctx, input }: UpdateOptions) {
  const businessHoursService = getBusinessHoursService();

  return businessHoursService.upsertForUser(ctx.user.id, input);
}

export default updateHandler;
