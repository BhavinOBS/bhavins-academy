-- AlterTable
ALTER TABLE "Course" 
ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT NOW();

ALTER TABLE "Course" 
ADD COLUMN "duration" TEXT DEFAULT 'Self-paced';

ALTER TABLE "Course" 
ADD COLUMN "level" TEXT DEFAULT 'Beginner';

