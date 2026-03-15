/*
  Warnings:

  - You are about to drop the `_BlogTag` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `feature_groups` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `features` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `tags` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_BlogTag" DROP CONSTRAINT "_BlogTag_A_fkey";

-- DropForeignKey
ALTER TABLE "_BlogTag" DROP CONSTRAINT "_BlogTag_B_fkey";

-- DropForeignKey
ALTER TABLE "features" DROP CONSTRAINT "features_feature_group_id_fkey";

-- AlterTable
ALTER TABLE "blogs" ADD COLUMN     "tags" TEXT[];

-- DropTable
DROP TABLE "_BlogTag";

-- DropTable
DROP TABLE "feature_groups";

-- DropTable
DROP TABLE "features";

-- DropTable
DROP TABLE "tags";
