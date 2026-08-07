/*
  Warnings:

  - You are about to drop the column `fundName` on the `FundConstituent` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[fundId,securityId]` on the table `FundConstituent` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `fundId` to the `FundConstituent` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "public"."FundConstituent_fundName_idx";

-- AlterTable
ALTER TABLE "public"."FundConstituent" DROP COLUMN "fundName",
ADD COLUMN     "fundId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."Holding" ADD COLUMN     "fundId" TEXT;

-- CreateTable
CREATE TABLE "public"."Fund" (
    "id" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "public"."AssetType" NOT NULL,
    "issuer" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Fund_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Fund_symbol_key" ON "public"."Fund"("symbol");

-- CreateIndex
CREATE UNIQUE INDEX "FundConstituent_fundId_securityId_key" ON "public"."FundConstituent"("fundId", "securityId");

-- AddForeignKey
ALTER TABLE "public"."Holding" ADD CONSTRAINT "Holding_fundId_fkey" FOREIGN KEY ("fundId") REFERENCES "public"."Fund"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."FundConstituent" ADD CONSTRAINT "FundConstituent_fundId_fkey" FOREIGN KEY ("fundId") REFERENCES "public"."Fund"("id") ON DELETE CASCADE ON UPDATE CASCADE;
