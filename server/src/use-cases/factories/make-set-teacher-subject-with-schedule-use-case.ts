import { PrismaTeachersRepository } from '@/repositories/prisma/prisma-teachers-repository'
import { SetTeacherSubjectWithScheduleUseCase } from '../set-teacher-subject-with-schedule'

export function makeSetTeacherSubjectWithScheduleUseCase() {
  const repository = new PrismaTeachersRepository()
  const useCase = new SetTeacherSubjectWithScheduleUseCase(repository)
  return useCase
}
