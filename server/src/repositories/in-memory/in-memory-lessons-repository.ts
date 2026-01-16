import { randomUUID } from 'node:crypto'
import type { Lesson, Prisma, User } from 'generated/prisma'
import type {
  FindByStudentIdOnTimeOptionsProps,
  FindByTeacherIdOnTimeOptions,
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
    delete (student as Partial<User>).passwordHash

    const teacher = await this.repositories.inMemoryTeachersRepository.findById(
      lesson.teacherId,
    )
    if (!teacher) return null

    const teacherUser =
      await this.repositories.inMemoryUsersRepository.findById(teacher.userId)
    if (!teacherUser) return null
    delete (teacherUser as Partial<User>).passwordHash

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

  async findManyByTeacherIdOnTime(
    teacherId: string,
    options: FindByTeacherIdOnTimeOptions,
  ) {
    const lessons = this.items.filter((item) => {
      return (
        item.teacherId === teacherId &&
        item.startTime >= options.from &&
        item.endTime < options.to
      )
    })

    return lessons
  }

  async findManyByStudentIdOnTime(
    studentId: string,
    options: FindByStudentIdOnTimeOptionsProps,
  ) {
    const lessons = this.items.filter((item) => {
      return (
        item.studentId === studentId &&
        item.startTime >= options.from &&
        item.endTime < options.to
      )
    })

    return lessons
  }

  async findByTeacherIdOnTime(
    teacherId: string,
    options: FindByTeacherIdOnTimeOptions,
  ) {
    const lesson = this.items.find((item) => {
      const startsBeforeLesson =
        options.from <= item.startTime && options.to > item.startTime

      const occursDuringLesson =
        options.from >= item.startTime && options.to <= item.endTime

      const startsDuringLesson =
        options.from < item.endTime && options.to >= item.endTime

      return (
        item.teacherId === teacherId &&
        (startsBeforeLesson || occursDuringLesson || startsDuringLesson)
      )
    })

    if (!lesson) return null

    return lesson
  }

  async findByStudentIdOnTime(
    studentId: string,
    options: FindByStudentIdOnTimeOptionsProps,
  ) {
    const lesson = this.items.find((item) => {
      const startsBeforeLesson =
        options.from <= item.startTime && options.to > item.startTime

      const occursDuringLesson =
        options.from >= item.startTime && options.to <= item.endTime

      const startsDuringLesson =
        options.from < item.endTime && options.to >= item.endTime

      return (
        item.studentId === studentId &&
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
