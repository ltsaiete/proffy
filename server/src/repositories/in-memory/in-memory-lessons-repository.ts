import { randomUUID } from 'node:crypto'
import type { Lesson, Prisma } from 'generated/prisma'
import type {
  FindByStudentIdOnTimeProps,
  FindByTeacherIdOnTimeProps,
  LessonsRepository,
} from '../lessons-repository'

export class InMemoryLessonsRepository implements LessonsRepository {
  public items: Lesson[] = []

  async findByTeacherIdOnTime(data: FindByTeacherIdOnTimeProps) {
    const lesson = this.items.find((item) => {
      const startsBeforeLesson =
        data.startTime <= item.startTime && data.endTime > item.startTime

      const occursDuringLesson =
        data.startTime >= item.startTime && data.endTime <= item.endTime

      const startsDuringLesson =
        data.startTime < item.endTime && data.endTime >= item.endTime

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
        data.startTime <= item.startTime && data.endTime > item.startTime

      const occursDuringLesson =
        data.startTime >= item.startTime && data.endTime <= item.endTime

      const startsDuringLesson =
        data.startTime < item.endTime && data.endTime >= item.endTime

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
