import type { Lesson, Prisma } from 'generated/prisma'

export interface FindByTeacherIdOnTimeProps {
  teacherId: string
  from: Date
  to: Date
}

export interface FindByStudentIdOnTimeProps {
  studentId: string
  from: Date
  to: Date
}

export interface LessonsRepository {
  create(data: Prisma.LessonUncheckedCreateInput): Promise<Lesson>
  findManyByTeacherIdOnTime(
    data: FindByTeacherIdOnTimeProps,
  ): Promise<Lesson[]>
  findManyByStudentIdOnTime(
    data: FindByStudentIdOnTimeProps,
  ): Promise<Lesson[]>
  findByTeacherIdOnTime(
    data: FindByTeacherIdOnTimeProps,
  ): Promise<Lesson | null>

  findByStudentIdOnTime(
    data: FindByStudentIdOnTimeProps,
  ): Promise<Lesson | null>
}
