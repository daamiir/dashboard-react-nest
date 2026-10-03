-- CreateTable
CREATE TABLE "ProductColorImages" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "images" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProductColorImages_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProductColorImages_productId_color_key" ON "ProductColorImages"("productId", "color");

-- AddForeignKey
ALTER TABLE "ProductColorImages" ADD CONSTRAINT "ProductColorImages_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Backfill: first variant per product+color with images becomes the color set
INSERT INTO "ProductColorImages" ("id","productId","color","images","createdAt","updatedAt")
SELECT DISTINCT ON (v."productId", v."attributes"->>'color')
  gen_random_uuid()::text, v."productId", v."attributes"->>'color', v."images", now(), now()
FROM "ProductVariant" v
WHERE v."attributes"->>'color' IS NOT NULL AND cardinality(v."images") > 0
ORDER BY v."productId", v."attributes"->>'color', v."createdAt";

-- Variants whose images equal the set now inherit (empty override)
UPDATE "ProductVariant" v SET "images" = '{}'
FROM "ProductColorImages" c
WHERE c."productId" = v."productId"
  AND c."color" = v."attributes"->>'color'
  AND c."images" = v."images";