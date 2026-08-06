/*
  Warnings:

  - Added the required column `symbol` to the `Holding` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Holding" ADD COLUMN     "symbol" TEXT NOT NULL;
