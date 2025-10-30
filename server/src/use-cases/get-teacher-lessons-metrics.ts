import type { LessonsRepository } from '@/repositories/lessons-repository'

interface GetTeacherLessonsMetricsUseCaseProps {
  teacherId: string
}

interface GetTeacherLessonsMetricsUseCaseResponse {
  lessonsCount: number
}

export class GetTeacherLessonsMetricsUseCase {
  constructor(private repository: LessonsRepository) {}

  async execute({
    teacherId,
  }: GetTeacherLessonsMetricsUseCaseProps): Promise<GetTeacherLessonsMetricsUseCaseResponse> {
    const lessonsCount = await this.repository.countByTeacherId(teacherId)
    return { lessonsCount }
  }
}
