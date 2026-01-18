import { PrismaTeacherSchedulesRepository } from '@/repositories/prisma/prisma-teacher-schedules-repository'
import { PrismaTeachersRepository } from '@/repositories/prisma/prisma-teachers-repository'
import { SetTeacherScheduleUseCase } from '../set-teacher-schedule'

export function makeSetTeacherScheduleUseCase() {
  const teacherScheduleRepository = new PrismaTeacherSchedulesRepository()
  const teachersRepository = new PrismaTeachersRepository()
  const useCase = new SetTeacherScheduleUseCase(
    teacherScheduleRepository,
    teachersRepository,
  )
  return useCase
}
