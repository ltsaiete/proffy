import type { Prisma, TeacherSchedule } from 'generated/prisma'

export interface FindByTeacherIdOnWeekDayAndTimeRangeOptions {
  weekDay: number
  startTime: number
  endTime: number
}

export interface TeacherSchedulesRepository {
  findByTeacherIdOnWeekDayAndTimeRange(
    teacherId: string,
    options: FindByTeacherIdOnWeekDayAndTimeRangeOptions,
  ): Promise<TeacherSchedule | null>
  findManyByTeacherId(teacherId: string): Promise<TeacherSchedule[]>
  createMany(
    data: Prisma.TeacherScheduleUncheckedCreateInput[],
  ): Promise<Prisma.BatchPayload>

  saveMany(
    teacherId: string,
    data: Prisma.TeacherScheduleUncheckedCreateInput[],
  ): Promise<TeacherSchedule[]> 
}
