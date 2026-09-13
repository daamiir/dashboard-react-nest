/*
  Warnings:

  - The `category` column on the `Product` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `color` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `os` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `processor` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ram` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `releaseYear` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `screenSize` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `storage` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Category" AS ENUM ('SMARTPHONE', 'LAPTOP', 'TABLET', 'HEADPHONES');

-- DropIndex
DROP INDEX "Product_createdAt_idx";

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "attributes" JSONB,
ADD COLUMN     "color" TEXT NOT NULL,
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "has5G" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "hasNfc" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "images" TEXT[],
ADD COLUMN     "os" TEXT NOT NULL,
ADD COLUMN     "processor" TEXT NOT NULL,
ADD COLUMN     "ram" INTEGER NOT NULL,
ADD COLUMN     "releaseYear" INTEGER NOT NULL,
ADD COLUMN     "screenSize" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "storage" INTEGER NOT NULL,
DROP COLUMN "category",
ADD COLUMN     "category" "Category" NOT NULL DEFAULT 'SMARTPHONE';

-- CreateIndex
CREATE INDEX "Product_category_idx" ON "Product"("category");

-- CreateIndex
CREATE INDEX "Product_ram_idx" ON "Product"("ram");

-- CreateIndex
CREATE INDEX "Product_storage_idx" ON "Product"("storage");

-- CreateIndex
CREATE INDEX "Product_price_idx" ON "Product"("price");

-- CreateIndex
CREATE INDEX "Product_os_idx" ON "Product"("os");

-- CreateIndex
CREATE INDEX "Product_has5G_idx" ON "Product"("has5G");
