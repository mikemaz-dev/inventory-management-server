/*
  Warnings:

  - Made the column `description` on table `inventories` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "inventories" ALTER COLUMN "description" SET NOT NULL;
