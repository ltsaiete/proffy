import dayjs from 'dayjs'
import type { Lesson } from 'generated/prisma'
import type { LessonsRepository } from '@/repositories/lessons-repository'

interface FetchTeacherLessonsUseCaseProps {
  teacherId: string
}

interface FetchTeacherLessonsUseCaseResponse {
  lessons: Lesson[]
}

export class FetchTeacherLessonsUseCase {
  constructor(private repository: LessonsRepository) {}

  async execute({
    teacherId,
  }: FetchTeacherLessonsUseCaseProps): Promise<FetchTeacherLessonsUseCaseResponse> {
    const today = new Date()
    const weekAfterToday = dayjs(new Date()).add(7, 'day').toDate()

    const lessons = await this.repository.findManyByTeacherIdOnTime({
      teacherId,
      from: today,
      to: weekAfterToday,
    })
    return { lessons }
  }
}
