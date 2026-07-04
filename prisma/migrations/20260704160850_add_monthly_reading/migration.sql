-- CreateTable
CREATE TABLE "MonthlyReading" (
    "id" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "month" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "sections" JSONB,
    "failureReason" TEXT,
    "heldSections" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MonthlyReading_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MonthlyReading_profileId_month_key" ON "MonthlyReading"("profileId", "month");

-- AddForeignKey
ALTER TABLE "MonthlyReading" ADD CONSTRAINT "MonthlyReading_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
