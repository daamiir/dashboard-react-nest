-- AlterTable
ALTER TABLE "ProductVariant" ADD COLUMN     "position" INTEGER NOT NULL DEFAULT 0;

-- Backfill: keep the current order (by creation time) per product
UPDATE "ProductVariant" v SET "position" = r.rn
FROM (
  SELECT id, ROW_NUMBER() OVER (PARTITION BY "productId" ORDER BY "createdAt") - 1 AS rn
  FROM "ProductVariant"
) r
WHERE v.id = r.id;