/*
  Warnings:

  - You are about to drop the column `features` on the `properties` table. All the data in the column will be lost.
  - You are about to drop the column `tags` on the `properties` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `contact_info` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "properties" DROP COLUMN "features",
DROP COLUMN "tags";

-- CreateTable
CREATE TABLE "_PropertyTag" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_PropertyTag_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_PropertyFeature" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_PropertyFeature_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_PropertyTag_B_index" ON "_PropertyTag"("B");

-- CreateIndex
CREATE INDEX "_PropertyFeature_B_index" ON "_PropertyFeature"("B");

-- CreateIndex
CREATE UNIQUE INDEX "contact_info_email_key" ON "contact_info"("email");

-- AddForeignKey
ALTER TABLE "_PropertyTag" ADD CONSTRAINT "_PropertyTag_A_fkey" FOREIGN KEY ("A") REFERENCES "properties"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PropertyTag" ADD CONSTRAINT "_PropertyTag_B_fkey" FOREIGN KEY ("B") REFERENCES "tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PropertyFeature" ADD CONSTRAINT "_PropertyFeature_A_fkey" FOREIGN KEY ("A") REFERENCES "features"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PropertyFeature" ADD CONSTRAINT "_PropertyFeature_B_fkey" FOREIGN KEY ("B") REFERENCES "properties"("id") ON DELETE CASCADE ON UPDATE CASCADE;
