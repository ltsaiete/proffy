import { hash } from 'bcryptjs'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { InMemoryLessonsRepository } from '@/repositories/in-memory/in-memory-lessons-repository'
import { InMemorySubjectsRepository } from '@/repositories/in-memory/in-memory-subjects-repository'
import { InMemoryTeacherSchedulesRepository } from '@/repositories/in-memory/in-memory-teacher-schedules-repository'
import { InMemoryTeachersRepository } from '@/repositories/in-memory/in-memory-teachers-repository'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { FetchTeacherLessonsHistoryUseCase } from './fetch-teacher-lessons-history'

describe('Fetch teacher lessons history use case', () => {
  let teachersRepository: InMemoryTeachersRepository
  let usersRepository: InMemoryUsersRepository
  let subjectsRepository: InMemorySubjectsRepository
  let teacherSchedulesRepository: InMemoryTeacherSchedulesRepository
  let lessonsRepository: InMemoryLessonsRepository
  let sut: FetchTeacherLessonsHistoryUseCase

  beforeEach(() => {
    teacherSchedulesRepository = new InMemoryTeacherSchedulesRepository()
    teachersRepository = new InMemoryTeachersRepository({
      inMemoryTeacherSchedulesRepository: teacherSchedulesRepository,
    })
    usersRepository = new InMemoryUsersRepository()
    subjectsRepository = new InMemorySubjectsRepository()
    lessonsRepository = new InMemoryLessonsRepository()

    sut = new FetchTeacherLessonsHistoryUseCase(lessonsRepository)
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('Should list teacher lessons history', async () => {
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

    await lessonsRepository.create({
      teacherId: 'teacher-01',
      studentId: 'student-01',
      startTime: new Date(2025, 0, 19, 7, 0, 0),
      endTime: new Date(2025, 0, 19, 9, 0, 0),
    })
    await lessonsRepository.create({
      teacherId: 'teacher-01',
      studentId: 'student-01',
      startTime: new Date(2025, 0, 25, 8, 0, 0),
      endTime: new Date(2025, 0, 25, 12, 0, 0),
    })

    const { lessons } = await sut.execute({
      teacherId: 'teacher-01',
      page: 1,
    })

    expect(lessons).toHaveLength(2)
    expect(lessons).toEqual([
      expect.objectContaining({
        teacherId: 'teacher-01',
        id: expect.any(String),
      }),
      expect.objectContaining({
        teacherId: 'teacher-01',
        id: expect.any(String),
      }),
    ])
  })
  it('Should list paginated teacher lessons history', async () => {
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

    await usersRepository.create({
      id: 'student-02',
      name: 'Student 2',
      email: 'student02@example.com',
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
          weekDay: 1,
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
    await lessonsRepository.create({
      teacherId: 'teacher-01',
      studentId: 'student-02',
      startTime: new Date(2025, 0, 20, 7, 0, 0),
      endTime: new Date(2025, 0, 20, 7, 30, 0),
    })

    await lessonsRepository.create({
      teacherId: 'teacher-01',
      studentId: 'student-02',
      startTime: new Date(2025, 0, 20, 8, 0, 0),
      endTime: new Date(2025, 0, 20, 8, 30, 0),
    })

    const { lessons } = await sut.execute({
      teacherId: 'teacher-01',
      page: 2,
    })

    expect(lessons).toHaveLength(2)
    expect(lessons).toEqual([
      expect.objectContaining({
        teacherId: 'teacher-01',
        studentId: 'student-02',
        id: expect.any(String),
      }),
      expect.objectContaining({
        teacherId: 'teacher-01',
        studentId: 'student-02',
        id: expect.any(String),
      }),
    ])
  })
})
// days above 7
