-- SavedChart table is currently empty, so a NOT NULL UNIQUE column can be added
-- directly with no backfill step needed.
ALTER TABLE "SavedChart" ADD COLUMN "shareToken" TEXT NOT NULL;

CREATE UNIQUE INDEX "SavedChart_shareToken_key" ON "SavedChart"("shareToken");
