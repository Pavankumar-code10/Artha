-- AlterTable
ALTER TABLE "public"."Holding" ALTER COLUMN "symbol" DROP NOT NULL;

-- CreateTable
CREATE TABLE "public"."Security" (
    "id" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "sector" TEXT NOT NULL,
    "industry" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Security_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."FundConstituent" (
    "id" TEXT NOT NULL,
    "fundName" TEXT NOT NULL,
    "securityId" TEXT NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FundConstituent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Security_symbol_key" ON "public"."Security"("symbol");

-- CreateIndex
CREATE INDEX "FundConstituent_fundName_idx" ON "public"."FundConstituent"("fundName");

-- AddForeignKey
ALTER TABLE "public"."FundConstituent" ADD CONSTRAINT "FundConstituent_securityId_fkey" FOREIGN KEY ("securityId") REFERENCES "public"."Security"("id") ON DELETE CASCADE ON UPDATE CASCADE;
