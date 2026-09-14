/*
  Warnings:

  - The `category` column on the `Product` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `attributes` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "btree_gin";

-- CreateEnum
CREATE TYPE "Category" AS ENUM ('SMARTPHONE', 'LAPTOP', 'TABLET', 'HEADPHONES');

-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_sellerId_fkey";

-- DropIndex
DROP INDEX "Product_createdAt_idx";

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "attributes" JSONB NOT NULL,
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "images" TEXT[],
DROP COLUMN "category",
ADD COLUMN     "category" "Category" NOT NULL DEFAULT 'SMARTPHONE';

-- CreateIndex
CREATE INDEX "Product_attributes_idx" ON "Product" USING GIN ("attributes" jsonb_path_ops);

-- CreateIndex
CREATE INDEX "Product_category_idx" ON "Product"("category");

-- CreateIndex
CREATE INDEX "Product_price_idx" ON "Product"("price");

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
