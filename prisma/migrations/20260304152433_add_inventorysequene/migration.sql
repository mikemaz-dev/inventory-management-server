-- CreateTable
CREATE TABLE "inventory_sequences" (
    "inventory_id" TEXT NOT NULL,
    "value" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "inventory_sequences_pkey" PRIMARY KEY ("inventory_id")
);

-- AddForeignKey
ALTER TABLE "inventory_sequences" ADD CONSTRAINT "inventory_sequences_inventory_id_fkey" FOREIGN KEY ("inventory_id") REFERENCES "inventories"("id") ON DELETE CASCADE ON UPDATE CASCADE;
