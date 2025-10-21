/*
  Warnings:

  - You are about to drop the column `cost` on the `teacher_subjects` table. All the data in the column will be lost.
  - Added the required column `price` to the `teacher_subjects` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `teacher_subjects` DROP COLUMN `cost`,
    ADD COLUMN `price` INTEGER NOT NULL;
