import { PrismaTeachersRepository } from '@/repositories/prisma/prisma-teachers-repository'
import { FetchTeachersBySubjectUseCase } from '../fetch-teachers-by-subject'

export function makeFetchTeachersBySubjectUseCase() {
  const repository = new PrismaTeachersRepository()
  const useCase = new FetchTeachersBySubjectUseCase(repository)
  return useCase
}
