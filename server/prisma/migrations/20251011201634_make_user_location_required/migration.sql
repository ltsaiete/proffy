/*
  Warnings:

  - Made the column `latitude` on table `users` required. This step will fail if there are existing NULL values in that column.
  - Made the column `longitude` on table `users` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `users` MODIFY `latitude` DECIMAL(65, 30) NOT NULL,
    MODIFY `longitude` DECIMAL(65, 30) NOT NULL;
