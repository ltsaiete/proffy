import { randomUUID } from 'node:crypto'
import type { Prisma, TeacherSchedule } from 'generated/prisma'
import type {
  FindByTeacherIdOnWeekDayAndTimeRangeOptions,
  TeacherSchedulesRepository,
} from '../teacher-schedules-repository'

export class InMemoryTeacherSchedulesRepository
  implements TeacherSchedulesRepository
{
  public items: TeacherSchedule[] = []

  async findByTeacherIdOnWeekDayAndTimeRange(
    teacherId: string,
    options: FindByTeacherIdOnWeekDayAndTimeRangeOptions,
  ) {
    const teacherSchedule = this.items.find((schedule) => {
      const isSameTeacherId = schedule.teacherId === teacherId
      const isSameWeekDay = schedule.weekDay === options.weekDay
      const startsWithinScheduleTime = schedule.startTime <= options.startTime
      const endsWithinScheduleTime = schedule.endTime >= options.endTime

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

  async saveMany(
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
    this.items = schedules
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
      id: schedule.id ? schedule.id : randomUUID(),
      ...schedule,
    }))
    this.items.push(...schedules)

    return { count: schedules.length }
  }
}
