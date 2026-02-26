-- AlterTable
ALTER TABLE "inventories" ALTER COLUMN "description" DROP NOT NULL,
ALTER COLUMN "is_public" SET DEFAULT false;
