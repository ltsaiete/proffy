import { PrismaLessonsRepository } from '@/repositories/prisma/prisma-lessons-repository'
import { FetchStudentLessonsUseCase } from '../fetch-student-lessons'

export function makeFetchStudentLessonsUseCase() {
  const repository = new PrismaLessonsRepository()
  const useCase = new FetchStudentLessonsUseCase(repository)
  return useCase
}
