import { PrismaTeacherSchedulesRepository } from '@/repositories/prisma/prisma-teacher-schedules-repository'
import { GetTeacherScheduleUseCase } from '../get-teacher-schedule'

export function makeGetTeacherScheduleUseCase() {
  const repository = new PrismaTeacherSchedulesRepository()
  const useCase = new GetTeacherScheduleUseCase(repository)
  return useCase
}
