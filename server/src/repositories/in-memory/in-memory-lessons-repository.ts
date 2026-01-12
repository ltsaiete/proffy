import { randomUUID } from 'node:crypto'
import type { Lesson, Prisma } from 'generated/prisma'
import type {
  FindByStudentIdOnTimeProps,
  FindByTeacherIdOnTimeProps,
  LessonsRepository,
  LessonWithStudentAndTeacher,
} from '../lessons-repository'
import type { TeachersRepository } from '../teachers-repository'
import type { UsersRepository } from '../users-repository'

export class InMemoryLessonsRepository implements LessonsRepository {
  public items: Lesson[] = []

  constructor(
    private repositories: {
      inMemoryUsersRepository?: UsersRepository
      inMemoryTeachersRepository?: TeachersRepository
    } = {},
  ) {}

  async findById(id: string) {
    if (
      !this.repositories.inMemoryUsersRepository ||
      !this.repositories.inMemoryTeachersRepository
    )
      throw new Error()

    const lesson = this.items.find((lesson) => lesson.id === id)
    if (!lesson) return null

    const student = await this.repositories.inMemoryUsersRepository.findById(
      lesson.studentId,
    )
    if (!student) return null

    const teacher = await this.repositories.inMemoryTeachersRepository.findById(
      lesson.teacherId,
    )
    if (!teacher) return null

    const teacherUser =
      await this.repositories.inMemoryUsersRepository.findById(teacher.userId)
    if (!teacherUser) return null

    const serializedLesson = {
      ...lesson,
      student,
      teacher: {
        ...teacher,
        user: teacherUser,
      },
    }
    return serializedLesson
  }
  async countByTeacherId(teacherId: string) {
    const lessons = this.items.filter((item) => {
      return item.teacherId === teacherId
    })

    return lessons.length
  }

  async findManyByTeacherId(teacherId: string, page: number) {
    const lessons = this.items
      .filter((item) => {
        return item.teacherId === teacherId
      })
      .slice((page - 1) * 10, page * 10)

    return lessons
  }

  async findManyByTeacherIdOnTime(data: FindByTeacherIdOnTimeProps) {
    const lessons = this.items.filter((item) => {
      return (
        item.teacherId === data.teacherId &&
        item.startTime >= data.from &&
        item.endTime < data.to
      )
    })

    return lessons
  }

  async findManyByStudentIdOnTime(data: FindByStudentIdOnTimeProps) {
    const lessons = this.items.filter((item) => {
      return (
        item.studentId === data.studentId &&
        item.startTime >= data.from &&
        item.endTime < data.to
      )
    })

    return lessons
  }

  async findByTeacherIdOnTime(data: FindByTeacherIdOnTimeProps) {
    const lesson = this.items.find((item) => {
      const startsBeforeLesson =
        data.from <= item.startTime && data.to > item.startTime

      const occursDuringLesson =
        data.from >= item.startTime && data.to <= item.endTime

      const startsDuringLesson =
        data.from < item.endTime && data.to >= item.endTime

      return (
        item.teacherId === data.teacherId &&
        (startsBeforeLesson || occursDuringLesson || startsDuringLesson)
      )
    })

    if (!lesson) return null

    return lesson
  }

  async findByStudentIdOnTime(data: FindByStudentIdOnTimeProps) {
    const lesson = this.items.find((item) => {
      const startsBeforeLesson =
        data.from <= item.startTime && data.to > item.startTime

      const occursDuringLesson =
        data.from >= item.startTime && data.to <= item.endTime

      const startsDuringLesson =
        data.from < item.endTime && data.to >= item.endTime

      return (
        item.studentId === data.studentId &&
        (startsBeforeLesson || occursDuringLesson || startsDuringLesson)
      )
    })

    if (!lesson) return null

    return lesson
  }

  async create(data: Prisma.LessonUncheckedCreateInput) {
    const lesson = {
      id: data.id ? data.id : randomUUID(),
      startTime: new Date(data.startTime),
      endTime: new Date(data.endTime),
      studentId: data.studentId,
      teacherId: data.teacherId,
    }

    this.items.push(lesson)

    return lesson
  }
}
