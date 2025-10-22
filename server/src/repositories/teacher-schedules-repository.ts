import type { Prisma, TeacherSchedule } from 'generated/prisma'

export interface TeacherSchedulesRepository {
  findManyByTeacherId(teacherId: string): Promise<TeacherSchedule[]>
  createMany(
    data: Prisma.TeacherScheduleUncheckedCreateInput[],
  ): Promise<TeacherSchedule[]>

  updateMany(
    teacherId: string,
    data: Prisma.TeacherScheduleUncheckedCreateInput[],
  ): Promise<TeacherSchedule[]>
}
