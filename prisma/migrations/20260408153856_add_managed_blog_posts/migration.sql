-- CreateEnum
CREATE TYPE "ContentAccent" AS ENUM ('CYAN', 'VIOLET', 'LIME');

-- CreateTable
CREATE TABLE "managed_blog_posts" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "readingTime" TEXT,
    "publishedAt" TIMESTAMP(3) NOT NULL,
    "accent" "ContentAccent" NOT NULL DEFAULT 'CYAN',
    "tags" JSONB NOT NULL,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "managed_blog_posts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "managed_blog_posts_slug_key" ON "managed_blog_posts"("slug");
