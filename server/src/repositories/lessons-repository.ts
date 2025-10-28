import type { Lesson, Prisma } from 'generated/prisma'

export interface FindByTeacherIdOnTimeProps {
  teacherId: string
  startTime: Date
  endTime: Date
}

export interface FindByStudentIdOnTimeProps {
  studentId: string
  startTime: Date
  endTime: Date
}

export interface LessonsRepository {
  create(data: Prisma.LessonUncheckedCreateInput): Promise<Lesson>
  findByTeacherIdOnTime(
    data: FindByTeacherIdOnTimeProps,
  ): Promise<Lesson | null>

  findByStudentIdOnTime(
    data: FindByStudentIdOnTimeProps,
  ): Promise<Lesson | null>
}
