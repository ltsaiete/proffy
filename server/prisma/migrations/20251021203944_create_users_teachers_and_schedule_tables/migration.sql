-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subjects" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "subjects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "teachers" (
    "price" INTEGER NOT NULL,
    "latitude" DECIMAL(65,30) NOT NULL,
    "longitude" DECIMAL(65,30) NOT NULL,
    "subject_id" TEXT NOT NULL,
    "teacher_id" TEXT NOT NULL,

    CONSTRAINT "teachers_pkey" PRIMARY KEY ("teacher_id","subject_id")
);

-- CreateTable
CREATE TABLE "teachers_schedules" (
    "id" TEXT NOT NULL,
    "week_day" INTEGER NOT NULL,
    "start_time" INTEGER NOT NULL,
    "end_time" INTEGER NOT NULL,
    "teacher_id" TEXT NOT NULL,

    CONSTRAINT "teachers_schedules_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "subjects_name_key" ON "subjects"("name");

-- CreateIndex
CREATE UNIQUE INDEX "teachers_teacher_id_key" ON "teachers"("teacher_id");

-- AddForeignKey
ALTER TABLE "teachers" ADD CONSTRAINT "teachers_subject_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "subjects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teachers" ADD CONSTRAINT "teachers_teacher_id_fkey" FOREIGN KEY ("teacher_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teachers_schedules" ADD CONSTRAINT "teachers_schedules_teacher_id_fkey" FOREIGN KEY ("teacher_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
