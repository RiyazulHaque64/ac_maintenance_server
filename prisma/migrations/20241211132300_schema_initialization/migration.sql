-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'BLOCKED');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('SUPER_ADMIN', 'ADMIN', 'USER');

-- CreateEnum
CREATE TYPE "PostingStatus" AS ENUM ('POSTED', 'NOT_POSTED');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "contact_number" TEXT,
    "profile_pic" TEXT,
    "status" "UserStatus" NOT NULL DEFAULT 'ACTIVE',
    "role" "UserRole" NOT NULL DEFAULT 'USER',
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "password_changed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "records" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "campaign" TEXT,
    "product" TEXT,
    "stakeholder" TEXT,
    "posting_quality" TEXT,
    "google_drive_files" TEXT,
    "playbook_link" TEXT,
    "uppromote_conversion" INTEGER NOT NULL DEFAULT 0,
    "asset_status" TEXT,
    "month_uploaded" TIMESTAMP(3),
    "REVO_pinterest" TEXT DEFAULT 'not-posted',
    "PIN_accounts_used" TEXT DEFAULT 'not-posted',
    "pinterest_PIN_click" INTEGER NOT NULL DEFAULT 0,
    "pinterest_view" INTEGER NOT NULL DEFAULT 0,
    "REVO_instagram" TEXT,
    "IG_like" INTEGER NOT NULL DEFAULT 0,
    "IG_comment" INTEGER NOT NULL DEFAULT 0,
    "IG_share" INTEGER NOT NULL DEFAULT 0,
    "IG_view" INTEGER NOT NULL DEFAULT 0,
    "IG_social_sets_used" TEXT,
    "partner_IG_link" TEXT,
    "REVO_twitter" TEXT DEFAULT 'not-posted',
    "REVO_tiktok" TEXT DEFAULT 'not-posted',
    "REVO_TT_view" INTEGER NOT NULL DEFAULT 0,
    "tiktok_accounts_used" TEXT DEFAULT 'not-posted',
    "partner_tiktok_link" TEXT DEFAULT 'not-posted',
    "partner_TT_like" INTEGER NOT NULL DEFAULT 0,
    "partner_TT_comment" INTEGER NOT NULL DEFAULT 0,
    "partner_TT_share" INTEGER NOT NULL DEFAULT 0,
    "partner_TT_view" INTEGER NOT NULL DEFAULT 0,
    "partner_TT_save" INTEGER NOT NULL DEFAULT 0,
    "TT_dummy_account_used" TEXT,
    "YT_account_used" TEXT DEFAULT 'not-posted',
    "partner_YT_link" TEXT DEFAULT 'not-posted',
    "partner_YT_like" INTEGER NOT NULL DEFAULT 0,
    "partner_YT_comment" INTEGER NOT NULL DEFAULT 0,
    "partner_YT_view" INTEGER NOT NULL DEFAULT 0,
    "partner_YT_save" INTEGER NOT NULL DEFAULT 0,
    "REVO_clubrevo_youtube" TEXT DEFAULT 'not-posted',
    "REVO_youtube" TEXT DEFAULT 'not-posted',
    "YT_clubrevo_like" INTEGER NOT NULL DEFAULT 0,
    "YT_clubrevo_view" INTEGER NOT NULL DEFAULT 0,
    "YT_REVOMADIC_like" INTEGER NOT NULL DEFAULT 0,
    "YT_REVOMADIC_comment" INTEGER NOT NULL DEFAULT 0,
    "YT_REVOMADIC_share" INTEGER NOT NULL DEFAULT 0,
    "YT_REVOMADIC_view" INTEGER NOT NULL DEFAULT 0,
    "creator_status" TEXT,
    "profile" TEXT,
    "posting_status" "PostingStatus" NOT NULL DEFAULT 'NOT_POSTED',
    "partner_HQ" TEXT,
    "portfolio" TEXT,
    "contributed_engagement" INTEGER NOT NULL DEFAULT 0,
    "by_tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "by_city" TEXT,
    "all_internet_search" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Image" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "cloud_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Image_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "otp" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "otp" INTEGER NOT NULL,
    "expires_at" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "otp_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "otp_otp_key" ON "otp"("otp");
