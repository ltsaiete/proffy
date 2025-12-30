import type { Prisma } from 'generated/prisma'
import { prisma } from '@/lib/prisma'
import type {
  FindByTeacherIdOnWeekDayAndTimeRangeProps,
  TeacherSchedulesRepository,
} from '../teacher-schedules-repository'

export class PrismaTeacherSchedulesRepository
  implements TeacherSchedulesRepository
{
  async findByTeacherIdOnWeekDayAndTimeRange({
    teacherId,
    weekDay,
    startTime,
    endTime,
  }: FindByTeacherIdOnWeekDayAndTimeRangeProps) {
    const teacherSchedule = await prisma.teacherSchedule.findFirst({
      where: {
        teacherId,
        weekDay,
        startTime: {
          lte: startTime,
        },
        endTime: {
          gte: endTime,
        },
      },
    })

    return teacherSchedule
  }

  async saveMany(
    teacherId: string,
    data: Prisma.TeacherScheduleUncheckedCreateInput[],
  ) {
    const schedules = await prisma.$transaction(async (tx) => {
      await tx.teacherSchedule.deleteMany({
        where: { teacherId },
      })

      await tx.teacherSchedule.createMany({
        data,
      })

      return tx.teacherSchedule.findMany({
        where: { teacherId },
      })
    })
    // const [, schedules] = await prisma.$transaction([
    //   prisma.teacherSchedule.deleteMany({ where: { teacherId } }),
    //   prisma.teacherSchedule.createMany({ data }),
    // ])
    return schedules
  }

  async findManyByTeacherId(teacherId: string) {
    const teacherSchedules = await prisma.teacherSchedule.findMany({
      where: { teacherId },
    })
    return teacherSchedules
  }

  async createMany(data: Prisma.TeacherScheduleUncheckedCreateInput[]) {
    const schedules = await prisma.teacherSchedule.createMany({
      data,
    })

    return schedules
  }
}
