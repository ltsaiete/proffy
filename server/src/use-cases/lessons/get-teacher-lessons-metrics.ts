import type { LessonsRepository } from '@/repositories/lessons-repository'
import type { TeachersRepository } from '@/repositories/teachers-repository'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'

interface GetTeacherLessonsMetricsUseCaseProps {
  teacherUserId: string
}

interface GetTeacherLessonsMetricsUseCaseResponse {
  lessonsCount: number
}

export class GetTeacherLessonsMetricsUseCase {
  constructor(
    private repository: LessonsRepository,
    private teachersRepository: TeachersRepository,
  ) {}

  async execute({
    teacherUserId,
  }: GetTeacherLessonsMetricsUseCaseProps): Promise<GetTeacherLessonsMetricsUseCaseResponse> {
    const teacher = await this.teachersRepository.findByUserId(teacherUserId)
    if (!teacher) throw new ResourceNotFoundError('Teacher')

    const lessonsCount = await this.repository.countByTeacherId(teacher.id)
    return { lessonsCount }
  }
}
