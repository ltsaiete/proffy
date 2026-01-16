import { PrismaTeachersRepository } from '@/repositories/prisma/prisma-teachers-repository'
import { RegisterTeacherUseCase } from '../register-teacher'

export function makeRegisterTeacherUseCase() {
  const repository = new PrismaTeachersRepository()
  const useCase = new RegisterTeacherUseCase(repository)
  return useCase
}
