import { PrismaTeachersRepository } from '@/repositories/prisma/prisma-teachers-repository'
import { FetchNearbyTeachersUseCase } from '../fetch-nearby-teachers'

export function makeFetchNearbyTeachersUseCase() {
  const repository = new PrismaTeachersRepository()
  const useCase = new FetchNearbyTeachersUseCase(repository)

  return useCase
}
