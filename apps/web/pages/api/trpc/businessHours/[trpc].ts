import { createNextApiHandler } from "@calcom/trpc/server/createNextApiHandler";
import { businessHoursRouter } from "@calcom/trpc/server/routers/viewer/businessHours/_router";

export default createNextApiHandler(businessHoursRouter);
