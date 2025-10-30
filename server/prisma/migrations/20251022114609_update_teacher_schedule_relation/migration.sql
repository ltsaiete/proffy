/*
  Warnings:

  - The primary key for the `teachers` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The required column `id` was added to the `teachers` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropForeignKey
ALTER TABLE "public"."teachers_schedules" DROP CONSTRAINT "teachers_schedules_teacher_id_fkey";

-- AlterTable
ALTER TABLE "teachers" DROP CONSTRAINT "teachers_pkey",
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "teachers_pkey" PRIMARY KEY ("id");

-- AddForeignKey
ALTER TABLE "teachers_schedules" ADD CONSTRAINT "teachers_schedules_teacher_id_fkey" FOREIGN KEY ("teacher_id") REFERENCES "teachers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
