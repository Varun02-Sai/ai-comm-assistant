-- CreateTable
CREATE TABLE "Draft" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "prompt" TEXT NOT NULL,
    "draft" TEXT NOT NULL,
    "tone" TEXT NOT NULL DEFAULT 'professional',
    "category" TEXT NOT NULL DEFAULT 'general',
    "isFavorite" BOOLEAN NOT NULL DEFAULT false,
    "wordCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
