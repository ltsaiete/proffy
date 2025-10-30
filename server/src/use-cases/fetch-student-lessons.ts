import dayjs from 'dayjs'
import type { Lesson } from 'generated/prisma'
import type { LessonsRepository } from '@/repositories/lessons-repository'

interface FetchStudentLessonsUseCaseProps {
studentId: string
}

interface FetchStudentLessonsUseCaseResponse {
  lessons: Lesson[]
}

export class FetchStudentLessonsUseCase {
  constructor(private repository: LessonsRepository) {}

  async execute({
    studentId,
  }: FetchStudentLessonsUseCaseProps): Promise<FetchStudentLessonsUseCaseResponse> {
    const today = new Date()
    const weekAfterToday = dayjs(new Date()).add(7, 'day').toDate()

    const lessons = await this.repository.findManyByStudentIdOnTime({
      studentId,
      from: today,
      to: weekAfterToday,
    })
    return { lessons }
  }
}
