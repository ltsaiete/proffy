import { PrismaLessonsRepository } from '@/repositories/prisma/prisma-lessons-repository'
import { GetLessonDetailsUseCase } from '../get-lesson-details'

export function makeGetLessonDetailsUseCase() {
  const repository = new PrismaLessonsRepository()
  const useCase = new GetLessonDetailsUseCase(repository)
  return useCase
}
