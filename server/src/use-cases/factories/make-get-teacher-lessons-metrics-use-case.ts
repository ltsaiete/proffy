import { PrismaLessonsRepository } from '@/repositories/prisma/prisma-lessons-repository'
import { GetTeacherLessonsMetricsUseCase } from '../get-teacher-lessons-metrics'

export function makeGetTeacherLessonsMetricsUseCase() {
  const repository = new PrismaLessonsRepository()
  const useCase = new GetTeacherLessonsMetricsUseCase(repository)
  return useCase
}
