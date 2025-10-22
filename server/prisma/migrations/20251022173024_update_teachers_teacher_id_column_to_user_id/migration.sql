/*
  Warnings:

  - You are about to drop the column `teacher_id` on the `teachers` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[user_id]` on the table `teachers` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `user_id` to the `teachers` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."teachers" DROP CONSTRAINT "teachers_teacher_id_fkey";

-- DropIndex
DROP INDEX "public"."teachers_teacher_id_key";

-- AlterTable
ALTER TABLE "teachers" DROP COLUMN "teacher_id",
ADD COLUMN     "user_id" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "teachers_user_id_key" ON "teachers"("user_id");

-- AddForeignKey
ALTER TABLE "teachers" ADD CONSTRAINT "teachers_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
