import { randomUUID } from 'node:crypto'
import { Prisma, type Teacher } from 'generated/prisma'
import type { TeacherSchedulesRepository } from '../teacher-schedules-repository'
import type {
  CreateWithScheduleProps,
  TeachersRepository,
} from '../teachers-repository'

export class InMemoryTeachersRepository implements TeachersRepository {
  public items: Teacher[] = []
  constructor(
    private inMemoryTeacherSchedulesRepository: TeacherSchedulesRepository,
  ) {}

  async findByUserId(teacherId: string) {
    const teacher = this.items.find((item) => item.userId === teacherId)
    if (!teacher) return null

    return teacher
  }

  async createWithSchedule(data: CreateWithScheduleProps) {
    const teacher = {
      id: randomUUID(),
      description: data.teacher.description ? data.teacher.description : null,
      price: data.teacher.price,
      userId: data.teacher.userId,
      subjectId: data.teacher.subjectId,
      latitude: new Prisma.Decimal(data.teacher.latitude.toString()),
      longitude: new Prisma.Decimal(data.teacher.longitude.toString()),
    }
    this.items.push(teacher)
    await this.inMemoryTeacherSchedulesRepository.createMany(
      data.schedule.map((schedule) => ({ ...schedule, teacherId: teacher.id })),
    )

    return teacher
  }
}
