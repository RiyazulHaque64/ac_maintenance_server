/*
  Warnings:

  - You are about to drop the column `title` on the `features` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `features` table. All the data in the column will be lost.
  - Added the required column `feature_group_id` to the `features` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `features` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "features" DROP COLUMN "title",
DROP COLUMN "type",
ADD COLUMN     "feature_group_id" TEXT NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "feature_groups" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "feature_groups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tags" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tags_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "features" ADD CONSTRAINT "features_feature_group_id_fkey" FOREIGN KEY ("feature_group_id") REFERENCES "feature_groups"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
