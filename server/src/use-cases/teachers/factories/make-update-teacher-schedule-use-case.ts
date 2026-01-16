import { PrismaTeacherSchedulesRepository } from '@/repositories/prisma/prisma-teacher-schedules-repository'
import { PrismaTeachersRepository } from '@/repositories/prisma/prisma-teachers-repository'
import { UpdateTeacherScheduleUseCase } from '../update-teacher-schedule'

export function makeUpdateTeacherScheduleUseCase() {
  const teacherSchedulesRepository = new PrismaTeacherSchedulesRepository()
  const teachersRepository = new PrismaTeachersRepository()
  const useCase = new UpdateTeacherScheduleUseCase(
    teacherSchedulesRepository,
    teachersRepository,
  )
  return useCase
}
