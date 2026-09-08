import authedProcedure from "../../../procedures/authedProcedure";
import { router } from "../../../trpc";
import { ZUpdateBusinessHoursSchema } from "./update.schema";

export const businessHoursRouter = router({
  get: authedProcedure.query(async ({ ctx }) => {
    const { getHandler } = await import("./get.handler");

    return getHandler({ ctx });
  }),

  update: authedProcedure.input(ZUpdateBusinessHoursSchema).mutation(async ({ ctx, input }) => {
    const { updateHandler } = await import("./update.handler");

    return updateHandler({ ctx, input });
  }),
});
