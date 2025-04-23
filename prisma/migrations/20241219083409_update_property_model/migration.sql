-- AlterTable
ALTER TABLE "properties" ALTER COLUMN "feature_image" DROP NOT NULL,
ALTER COLUMN "feature_image" DROP DEFAULT,
ALTER COLUMN "slug" DROP DEFAULT;
