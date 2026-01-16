import type { Lesson, Prisma, Teacher, User } from 'generated/prisma'

export interface FindByTeacherIdOnTimeOptions {
  from: Date
  to: Date
}

export interface FindByStudentIdOnTimeOptionsProps {
  from: Date
  to: Date
}

export interface LessonWithStudentAndTeacher extends Lesson {
  student: User
  teacher: Teacher & {
    user: User
  }
}

export interface LessonsRepository {
  create(data: Prisma.LessonUncheckedCreateInput): Promise<Lesson>
  countByTeacherId(teacherId: string): Promise<number>
  findById(id: string): Promise<LessonWithStudentAndTeacher | null>
  findManyByTeacherId(teacherId: string, page: number): Promise<Lesson[]>
  findManyByTeacherIdOnTime(
    teacherId: string,
    options: FindByTeacherIdOnTimeOptions,
  ): Promise<Lesson[]>
  findManyByStudentIdOnTime(
    studentId: string,
    options: FindByStudentIdOnTimeOptionsProps,
  ): Promise<Lesson[]>
  findByTeacherIdOnTime(
    teacherId: string,
    options: FindByTeacherIdOnTimeOptions,
  ): Promise<Lesson | null>

  findByStudentIdOnTime(
    studentId: string,
    options: FindByStudentIdOnTimeOptionsProps,
  ): Promise<Lesson | null>
}
