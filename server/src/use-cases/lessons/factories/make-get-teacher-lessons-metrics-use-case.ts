import { PrismaLessonsRepository } from '@/repositories/prisma/prisma-lessons-repository'
import { PrismaTeachersRepository } from '@/repositories/prisma/prisma-teachers-repository'
import { GetTeacherLessonsMetricsUseCase } from '../get-teacher-lessons-metrics'

export function makeGetTeacherLessonsMetricsUseCase() {
  const repository = new PrismaLessonsRepository()
  const teachersRepository = new PrismaTeachersRepository()
  const useCase = new GetTeacherLessonsMetricsUseCase(
    repository,
    teachersRepository,
  )
  return useCase
}
