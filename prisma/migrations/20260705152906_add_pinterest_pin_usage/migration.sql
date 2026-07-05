-- CreateTable
CREATE TABLE "PinterestPinUsage" (
    "id" TEXT NOT NULL,
    "board" TEXT NOT NULL,
    "itemKey" TEXT NOT NULL,
    "usedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PinterestPinUsage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PinterestPinUsage_board_idx" ON "PinterestPinUsage"("board");

-- CreateIndex
CREATE UNIQUE INDEX "PinterestPinUsage_board_itemKey_key" ON "PinterestPinUsage"("board", "itemKey");
