import { randomUUID } from 'node:crypto'
import type { Lesson, Prisma } from 'generated/prisma'
import type {
  FindByStudentIdOnTimeProps,
  FindByTeacherIdOnTimeProps,
  LessonsRepository,
} from '../lessons-repository'

export class InMemoryLessonsRepository implements LessonsRepository {
  public items: Lesson[] = []

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
      id: randomUUID(),
      startTime: new Date(data.startTime),
      endTime: new Date(data.endTime),
      studentId: data.studentId,
      teacherId: data.teacherId,
    }

    this.items.push(lesson)

    return lesson
  }
}
