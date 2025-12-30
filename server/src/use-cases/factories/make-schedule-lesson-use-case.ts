import { PrismaLessonsRepository } from '@/repositories/prisma/prisma-lessons-repository'
import { PrismaTeacherSchedulesRepository } from '@/repositories/prisma/prisma-teacher-schedules-repository'
import { PrismaTeachersRepository } from '@/repositories/prisma/prisma-teachers-repository'
import { ScheduleLessonUseCase } from '../schedule-lesson'

export function makeScheduleLessonUseCase() {
  const lessonsRepository = new PrismaLessonsRepository()
  const teachersRepository = new PrismaTeachersRepository()
  const teacherSchedulesRepository = new PrismaTeacherSchedulesRepository()

  const useCase = new ScheduleLessonUseCase(
    lessonsRepository,
    teachersRepository,
    teacherSchedulesRepository,
  )
  return useCase
}
