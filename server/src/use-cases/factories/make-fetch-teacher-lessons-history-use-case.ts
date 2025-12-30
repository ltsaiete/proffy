import { PrismaLessonsRepository } from '@/repositories/prisma/prisma-lessons-repository'
import { FetchTeacherLessonsHistoryUseCase } from '../fetch-teacher-lessons-history'

export function makeFetchTeacherLessonsHistoryUseCase() {
  const repository = new PrismaLessonsRepository()
  const useCase = new FetchTeacherLessonsHistoryUseCase(repository)
  return useCase
}
