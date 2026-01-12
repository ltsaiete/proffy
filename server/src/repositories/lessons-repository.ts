import type { Lesson, Prisma, Teacher, User } from 'generated/prisma'

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
  findManyByTeacherIdOnTime(data: FindByTeacherIdOnTimeProps): Promise<Lesson[]>
  findManyByStudentIdOnTime(data: FindByStudentIdOnTimeProps): Promise<Lesson[]>
  findByTeacherIdOnTime(
    data: FindByTeacherIdOnTimeProps,
  ): Promise<Lesson | null>

  findByStudentIdOnTime(
    data: FindByStudentIdOnTimeProps,
  ): Promise<Lesson | null>
}
