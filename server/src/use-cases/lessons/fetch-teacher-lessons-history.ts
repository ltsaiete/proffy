import type { Lesson } from 'generated/prisma'
import type { LessonsRepository } from '@/repositories/lessons-repository'
import type { TeachersRepository } from '@/repositories/teachers-repository'
import { UserNotTeacherError } from '../errors/user-not-teacher-error'

interface FetchTeacherLessonsHistoryUseCaseProps {
  teacherUserId: string
  page: number
}

interface FetchTeacherLessonsHistoryUseCaseResponse {
  lessons: Lesson[]
}

export class FetchTeacherLessonsHistoryUseCase {
  constructor(
    private lessonsRepository: LessonsRepository,
    private teachersRepository: TeachersRepository,
  ) {}

  async execute({
    teacherUserId,
    page,
  }: FetchTeacherLessonsHistoryUseCaseProps): Promise<FetchTeacherLessonsHistoryUseCaseResponse> {
    const teacher = await this.teachersRepository.findByUserId(teacherUserId)
    if (!teacher) throw new UserNotTeacherError()

    const lessons = await this.lessonsRepository.findManyByTeacherId(
      teacher.id,
      page,
    )
    return { lessons }
  }
}
