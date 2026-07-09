-- CreateTable
CREATE TABLE "YearReading" (
    "id" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "birthMonth" INTEGER NOT NULL,
    "birthDay" INTEGER NOT NULL,
    "readingYear" INTEGER NOT NULL,
    "yearCardIndex" INTEGER NOT NULL,
    "bearingIndex" INTEGER NOT NULL,
    "purchasedPaymentIntentId" TEXT,
    "shareToken" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "sections" JSONB,
    "failureReason" TEXT,
    "heldSections" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "YearReading_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "YearReading_purchasedPaymentIntentId_key" ON "YearReading"("purchasedPaymentIntentId");

-- CreateIndex
CREATE UNIQUE INDEX "YearReading_shareToken_key" ON "YearReading"("shareToken");

-- CreateIndex
CREATE INDEX "YearReading_ownerId_idx" ON "YearReading"("ownerId");

-- AddForeignKey
ALTER TABLE "YearReading" ADD CONSTRAINT "YearReading_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
