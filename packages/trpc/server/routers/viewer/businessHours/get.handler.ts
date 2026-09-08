import { getBusinessHoursService } from "@calcom/lib/businessHours/BusinessHoursService";
import type { TrpcSessionUser } from "@calcom/trpc/server/types";

type GetOptions = {
  ctx: {
    user: NonNullable<TrpcSessionUser>;
  };
};

export async function getHandler({ ctx }: GetOptions) {
  const businessHoursService = getBusinessHoursService();

  return businessHoursService.getForUser(ctx.user.id);
}

export default getHandler;
