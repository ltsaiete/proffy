import type { Lesson } from 'generated/prisma'
import type { LessonsRepository } from '@/repositories/lessons-repository'

interface FetchTeacherLessonsHistoryUseCaseProps {
  teacherId: string
  page: number
}

interface FetchTeacherLessonsHistoryUseCaseResponse {
  lessons: Lesson[]
}

export class FetchTeacherLessonsHistoryUseCase {
  constructor(private repository: LessonsRepository) {}

  async execute({
    teacherId,
    page,
  }: FetchTeacherLessonsHistoryUseCaseProps): Promise<FetchTeacherLessonsHistoryUseCaseResponse> {
    const lessons = await this.repository.findManyByTeacherId(teacherId, page)
    return { lessons }
  }
}
