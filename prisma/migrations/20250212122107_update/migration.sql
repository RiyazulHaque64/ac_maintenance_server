/*
  Warnings:

  - You are about to drop the column `location_id` on the `properties` table. All the data in the column will be lost.
  - You are about to drop the `locations` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "properties" DROP CONSTRAINT "properties_location_id_fkey";

-- DropIndex
DROP INDEX "properties_location_id_key";

-- AlterTable
ALTER TABLE "properties" DROP COLUMN "location_id",
ADD COLUMN     "location" JSONB;

-- DropTable
DROP TABLE "locations";
