import { PrismaLessonsRepository } from '@/repositories/prisma/prisma-lessons-repository'
import { PrismaTeachersRepository } from '@/repositories/prisma/prisma-teachers-repository'
import { FetchTeacherLessonsHistoryUseCase } from '../fetch-teacher-lessons-history'

export function makeFetchTeacherLessonsHistoryUseCase() {
  const repository = new PrismaLessonsRepository()
  const teachersRepository = new PrismaTeachersRepository()
  const useCase = new FetchTeacherLessonsHistoryUseCase(
    repository,
    teachersRepository,
  )
  return useCase
}
