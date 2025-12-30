import type { Prisma, TeacherSchedule } from 'generated/prisma'

export interface FindByTeacherIdOnWeekDayAndTimeRangeProps {
  teacherId: string
  weekDay: number
  startTime: number
  endTime: number
}

export interface TeacherSchedulesRepository {
  findByTeacherIdOnWeekDayAndTimeRange(
    data: FindByTeacherIdOnWeekDayAndTimeRangeProps,
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
