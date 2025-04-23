/*
  Warnings:

  - You are about to drop the column `tags` on the `blogs` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "blogs" DROP COLUMN "tags";

-- CreateTable
CREATE TABLE "_BlogTag" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_BlogTag_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_BlogTag_B_index" ON "_BlogTag"("B");

-- AddForeignKey
ALTER TABLE "_BlogTag" ADD CONSTRAINT "_BlogTag_A_fkey" FOREIGN KEY ("A") REFERENCES "blogs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BlogTag" ADD CONSTRAINT "_BlogTag_B_fkey" FOREIGN KEY ("B") REFERENCES "tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;
