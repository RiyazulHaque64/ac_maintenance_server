/*
  Warnings:

  - You are about to drop the column `contact_info_id` on the `properties` table. All the data in the column will be lost.
  - You are about to drop the column `location_id` on the `properties` table. All the data in the column will be lost.
  - You are about to drop the column `overview` on the `properties` table. All the data in the column will be lost.
  - You are about to drop the column `propertyDetails` on the `properties` table. All the data in the column will be lost.
  - You are about to drop the `location` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[property_id]` on the table `contact_info` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `property_id` to the `contact_info` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "properties" DROP CONSTRAINT "properties_contact_info_id_fkey";

-- DropForeignKey
ALTER TABLE "properties" DROP CONSTRAINT "properties_location_id_fkey";

-- DropIndex
DROP INDEX "properties_contact_info_id_key";

-- DropIndex
DROP INDEX "properties_location_id_key";

-- AlterTable
ALTER TABLE "contact_info" ADD COLUMN     "property_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "properties" DROP COLUMN "contact_info_id",
DROP COLUMN "location_id",
DROP COLUMN "overview",
DROP COLUMN "propertyDetails",
ADD COLUMN     "property_details" JSONB;

-- DropTable
DROP TABLE "location";

-- CreateTable
CREATE TABLE "locations" (
    "id" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "street" TEXT NOT NULL,
    "zip" TEXT,
    "property_id" TEXT NOT NULL,

    CONSTRAINT "locations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "locations_property_id_key" ON "locations"("property_id");

-- CreateIndex
CREATE UNIQUE INDEX "contact_info_property_id_key" ON "contact_info"("property_id");

-- AddForeignKey
ALTER TABLE "contact_info" ADD CONSTRAINT "contact_info_property_id_fkey" FOREIGN KEY ("property_id") REFERENCES "properties"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "locations" ADD CONSTRAINT "locations_property_id_fkey" FOREIGN KEY ("property_id") REFERENCES "properties"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
