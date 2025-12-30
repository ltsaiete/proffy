import { PrismaLessonsRepository } from '@/repositories/prisma/prisma-lessons-repository'
import { FetchTeacherLessonsUseCase } from '../fetch-teacher-lessons'

export function makeFetchTeacherLessonsUseCase() {
  const repository = new PrismaLessonsRepository()
  const useCase = new FetchTeacherLessonsUseCase(repository)
  return useCase
}
