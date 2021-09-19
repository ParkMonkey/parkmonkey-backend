/*
  Warnings:

  - Added the required column `maximumVehicles` to the `Property` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Property" ADD COLUMN     "maximumVehicles" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "ActiveRental" (
    "id" SERIAL NOT NULL,
    "propertyId" INTEGER NOT NULL,
    "renterId" INTEGER NOT NULL,

    CONSTRAINT "ActiveRental_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ActiveRental_propertyId_renterId_key" ON "ActiveRental"("propertyId", "renterId");

-- AddForeignKey
ALTER TABLE "ActiveRental" ADD CONSTRAINT "ActiveRental_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActiveRental" ADD CONSTRAINT "ActiveRental_renterId_fkey" FOREIGN KEY ("renterId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
