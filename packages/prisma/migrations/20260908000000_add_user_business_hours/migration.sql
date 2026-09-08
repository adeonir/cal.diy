-- CreateTable
CREATE TABLE "public"."UserBusinessHours" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "startTime" INTEGER NOT NULL DEFAULT 540,
    "endTime" INTEGER NOT NULL DEFAULT 1020,
    "days" INTEGER[] DEFAULT ARRAY[1, 2, 3, 4, 5]::INTEGER[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserBusinessHours_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserBusinessHours_userId_key" ON "public"."UserBusinessHours"("userId");

-- AddForeignKey
ALTER TABLE "public"."UserBusinessHours" ADD CONSTRAINT "UserBusinessHours_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
