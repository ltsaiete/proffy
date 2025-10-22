import { randomUUID } from 'node:crypto'
import type { Prisma, TeacherSchedule } from 'generated/prisma'
import type { TeacherSchedulesRepository } from '../teacher-schedules-repository'

export class InMemoryTeacherSchedulesRepository
  implements TeacherSchedulesRepository
{
  public items: TeacherSchedule[] = []

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
