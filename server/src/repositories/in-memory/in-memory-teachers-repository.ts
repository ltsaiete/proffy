import { randomUUID } from 'node:crypto'
import { Prisma, type Subject, type Teacher, type User } from 'generated/prisma'
import { getDistanceBetweenCoordinates } from '@/utils/get-distance-between-coordinates'
import type { SubjectsRepository } from '../subjects-repository'
import type { TeacherSchedulesRepository } from '../teacher-schedules-repository'
import type {
  CreateWithScheduleProps,
  FindManyNearbyProps,
  TeachersRepository,
} from '../teachers-repository'
import type { UsersRepository } from '../users-repository'
import { InMemoryUsersRepository } from './in-memory-users-repository'

export class InMemoryTeachersRepository implements TeachersRepository {
  public items: Teacher[] = []

  constructor(
    private repositories: {
      inMemoryTeacherSchedulesRepository?: TeacherSchedulesRepository
      inMemoryUsersRepository?: UsersRepository
      inMemorySubjectsRepository?: SubjectsRepository
    },
  ) {}

  async findManyNearby(params: FindManyNearbyProps) {
    if (
      !this.repositories.inMemoryUsersRepository ||
      !this.repositories.inMemorySubjectsRepository
    )
      throw new Error()

    const teachers = this.items.filter((teacher) => {
      const distance = getDistanceBetweenCoordinates(
        {
          latitude: params.latitude,
          longitude: params.longitude,
        },
        {
          latitude: teacher.latitude.toNumber(),
          longitude: teacher.longitude.toNumber(),
        },
      )

      return distance < 10
    })

    const serializedTeachers = await Promise.all(
      teachers.map(async (teacher) => {
        const user = (await this.repositories.inMemoryUsersRepository?.findById(
          teacher.userId,
        )) as User

        const subject =
          (await this.repositories.inMemorySubjectsRepository?.findById(
            teacher.subjectId,
          )) as Subject
        return { ...teacher, user, subject }
      }),
    )

    return serializedTeachers
  }

  async findManyBySubject(subjectId: string, page: number) {
    if (
      !this.repositories.inMemoryUsersRepository ||
      !this.repositories.inMemorySubjectsRepository
    )
      throw new Error()

    const teachers = this.items
      .filter((teacher) => teacher.subjectId === subjectId)
      .slice((page - 1) * 10, page * 10)

    const serializedTeachers = await Promise.all(
      teachers.map(async (teacher) => {
        const user = (await this.repositories.inMemoryUsersRepository?.findById(
          teacher.userId,
        )) as User

        const subject =
          (await this.repositories.inMemorySubjectsRepository?.findById(
            teacher.subjectId,
          )) as Subject
        return { ...teacher, user, subject }
      }),
    )

    return serializedTeachers
  }

  async findById(id: string) {
    const teacher = this.items.find((teacher) => teacher.id === id)

    if (!teacher) return null
    return teacher
  }

  async findByUserId(teacherId: string) {
    const teacher = this.items.find((item) => item.userId === teacherId)
    if (!teacher) return null

    return teacher
  }

  async createWithSchedule(data: CreateWithScheduleProps) {
    if (!this.repositories.inMemoryTeacherSchedulesRepository) throw new Error()

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
    await this.repositories.inMemoryTeacherSchedulesRepository.createMany(
      data.schedule.map((schedule) => ({ ...schedule, teacherId: teacher.id })),
    )

    return teacher
  }
}
