import { PrismaSubjectsRepository } from '@/repositories/prisma/prisma-subjects-repository'
import { CreateSubjectUseCase } from '../create-subject'

export function makeCreateSubjectUseCase() {
  const repository = new PrismaSubjectsRepository()
  const useCase = new CreateSubjectUseCase(repository)

  return useCase
}
