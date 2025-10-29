import { hash } from 'bcryptjs'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { InMemoryLessonsRepository } from '@/repositories/in-memory/in-memory-lessons-repository'
import { InMemorySubjectsRepository } from '@/repositories/in-memory/in-memory-subjects-repository'
import { InMemoryTeacherSchedulesRepository } from '@/repositories/in-memory/in-memory-teacher-schedules-repository'
import { InMemoryTeachersRepository } from '@/repositories/in-memory/in-memory-teachers-repository'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { GetTeacherLessonsMetricsUseCase } from './get-teacher-lessons-metrics'

describe('Get teacher lessons metrics use case', () => {
  let teachersRepository: InMemoryTeachersRepository
  let usersRepository: InMemoryUsersRepository
  let subjectsRepository: InMemorySubjectsRepository
  let teacherSchedulesRepository: InMemoryTeacherSchedulesRepository
  let lessonsRepository: InMemoryLessonsRepository
  let sut: GetTeacherLessonsMetricsUseCase

  beforeEach(() => {
    teacherSchedulesRepository = new InMemoryTeacherSchedulesRepository()
    teachersRepository = new InMemoryTeachersRepository({
      inMemoryTeacherSchedulesRepository: teacherSchedulesRepository,
    })
    usersRepository = new InMemoryUsersRepository()
    subjectsRepository = new InMemorySubjectsRepository()
    lessonsRepository = new InMemoryLessonsRepository()

    sut = new GetTeacherLessonsMetricsUseCase(lessonsRepository)
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('Should get teacher lessons count', async () => {
    vi.setSystemTime(new Date(2025, 0, 19, 0, 0, 0)) // Sunday, January 19

    await usersRepository.create({
      id: 'teacher-user-01',
      name: 'Teacher User',
      email: 'teacher@example.com',
      passwordHash: await hash('123456', 6),
    })

    await usersRepository.create({
      id: 'student-01',
      name: 'Student',
      email: 'student@example.com',
      passwordHash: await hash('123456', 6),
    })

    await subjectsRepository.create({
      id: 'subject-01',
      name: 'Maths',
    })

    await teachersRepository.createWithSchedule({
      teacher: {
        id: 'teacher-01',
        price: 10,
        userId: 'teacher-user-01',
        subjectId: 'subject-01',
        description: '',
        latitude: 0,
        longitude: 0,
      },
      schedule: [
        {
          weekDay: 0,
          startTime: 420,
          endTime: 1080,
        },
        {
          weekDay: 6,
          startTime: 420,
          endTime: 1080,
        },
      ],
    })

    const minLessonHour = 7

    // Create 10 lessons for student-01
    for (let i = minLessonHour; i < minLessonHour + 10; i++) {
      await lessonsRepository.create({
        teacherId: 'teacher-01',
        studentId: 'student-01',
        startTime: new Date(2025, 0, 19, i, 0, 0),
        endTime: new Date(2025, 0, 19, i, 30, 0),
      })
    }

    const { lessonsCount } = await sut.execute({
      teacherId: 'teacher-01',
    })

    expect(lessonsCount).toEqual(10)
  })
})
// days above 7
