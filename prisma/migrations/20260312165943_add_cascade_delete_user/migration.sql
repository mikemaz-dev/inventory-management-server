/*
  Warnings:

  - Added the required column `updated_at` to the `inventory_sequences` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "comments" DROP CONSTRAINT "comments_user_id_fkey";

-- DropForeignKey
ALTER TABLE "inventories" DROP CONSTRAINT "inventories_owner_id_fkey";

-- DropForeignKey
ALTER TABLE "inventory_access" DROP CONSTRAINT "inventory_access_user_id_fkey";

-- DropForeignKey
ALTER TABLE "items" DROP CONSTRAINT "items_created_by_fkey";

-- AlterTable
ALTER TABLE "inventory_sequences" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AddForeignKey
ALTER TABLE "inventories" ADD CONSTRAINT "inventories_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "items" ADD CONSTRAINT "items_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_access" ADD CONSTRAINT "inventory_access_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
