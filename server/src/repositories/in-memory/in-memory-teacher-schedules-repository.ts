import { randomUUID } from 'node:crypto'
import type { Prisma, TeacherSchedule } from 'generated/prisma'
import type {
  FindByTeacherIdOnWeekDayAndTimeRangeProps,
  TeacherSchedulesRepository,
} from '../teacher-schedules-repository'

export class InMemoryTeacherSchedulesRepository
  implements TeacherSchedulesRepository
{
  public items: TeacherSchedule[] = []

  async findByTeacherIdOnWeekDayAndTimeRange(
    data: FindByTeacherIdOnWeekDayAndTimeRangeProps,
  ) {
    const teacherSchedule = this.items.find((schedule) => {
      const isSameTeacherId = schedule.teacherId === data.teacherId
      const isSameWeekDay = schedule.weekDay === data.weekDay
      const startsWithinScheduleTime = schedule.startTime <= data.startTime
      const endsWithinScheduleTime = schedule.endTime >= data.endTime

      return (
        isSameTeacherId &&
        isSameWeekDay &&
        startsWithinScheduleTime &&
        endsWithinScheduleTime
      )
    })

    if (!teacherSchedule) return null

    return teacherSchedule
  }

  async updateMany(
    teacherId: string,
    data: Prisma.TeacherScheduleUncheckedCreateInput[],
  ) {
    const schedules = this.items.filter((item) => item.teacherId !== teacherId)
    schedules.push(
      ...data.map((schedule) => ({
        id: randomUUID(),
        ...schedule,
      })),
    )
    this.items.push(...schedules)
    return schedules
  }

  async findManyByTeacherId(teacherId: string) {
    const teacherSchedules = this.items.filter(
      (schedule) => schedule.teacherId === teacherId,
    )

    return teacherSchedules
  }

  async createMany(data: Prisma.TeacherScheduleUncheckedCreateInput[]) {
    const schedules = data.map((schedule) => ({
      id: randomUUID(),
      ...schedule,
    }))
    this.items.push(...schedules)

    return schedules
  }
}
