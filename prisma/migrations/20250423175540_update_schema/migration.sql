/*
  Warnings:

  - You are about to drop the `_PropertyFeature` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_PropertyTag` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `contact_info` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `properties` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_PropertyFeature" DROP CONSTRAINT "_PropertyFeature_A_fkey";

-- DropForeignKey
ALTER TABLE "_PropertyFeature" DROP CONSTRAINT "_PropertyFeature_B_fkey";

-- DropForeignKey
ALTER TABLE "_PropertyTag" DROP CONSTRAINT "_PropertyTag_A_fkey";

-- DropForeignKey
ALTER TABLE "_PropertyTag" DROP CONSTRAINT "_PropertyTag_B_fkey";

-- DropForeignKey
ALTER TABLE "properties" DROP CONSTRAINT "properties_contact_info_id_fkey";

-- DropForeignKey
ALTER TABLE "properties" DROP CONSTRAINT "properties_user_id_fkey";

-- DropTable
DROP TABLE "_PropertyFeature";

-- DropTable
DROP TABLE "_PropertyTag";

-- DropTable
DROP TABLE "contact_info";

-- DropTable
DROP TABLE "properties";

-- DropEnum
DROP TYPE "PostingStatus";

-- DropEnum
DROP TYPE "PropertyStatus";

-- DropEnum
DROP TYPE "PropertyType";
