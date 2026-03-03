/*
  Warnings:

  - You are about to drop the column `galleryId` on the `files` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "files" DROP CONSTRAINT "files_galleryId_fkey";

-- AlterTable
ALTER TABLE "files" DROP COLUMN "galleryId",
ADD COLUMN     "gallery_id" TEXT;

-- AddForeignKey
ALTER TABLE "files" ADD CONSTRAINT "files_gallery_id_fkey" FOREIGN KEY ("gallery_id") REFERENCES "Gallery"("id") ON DELETE SET NULL ON UPDATE CASCADE;
