-- Adds the account holder's own-chart one-off unlock field, and makes
-- SavedChart.purchasedPaymentIntentId unique so the Stripe webhook can upsert on
-- it as an idempotency key. No existing rows have a non-null value here, so the
-- unique index can be added directly with no backfill step needed.
ALTER TABLE "Profile" ADD COLUMN "ownChartPurchasedPaymentIntentId" TEXT;

CREATE UNIQUE INDEX "SavedChart_purchasedPaymentIntentId_key" ON "SavedChart"("purchasedPaymentIntentId");
