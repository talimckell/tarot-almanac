-- CreateTable
CREATE TABLE "ReclaimedReversalUsage" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "usedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ReclaimedReversalUsage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ReclaimedReversalUsage_slug_key" ON "ReclaimedReversalUsage"("slug");
