import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { InMemoryLessonsRepository } from '@/repositories/in-memory/in-memory-lessons-repository'
import { InMemoryTeachersRepository } from '@/repositories/in-memory/in-memory-teachers-repository'
import { FetchTeacherLessonsHistoryUseCase } from './fetch-teacher-lessons-history'

let teachersRepository: InMemoryTeachersRepository
let lessonsRepository: InMemoryLessonsRepository
let sut: FetchTeacherLessonsHistoryUseCase

describe('Fetch teacher lessons history use case', () => {
  beforeEach(async () => {
    teachersRepository = new InMemoryTeachersRepository()
    lessonsRepository = new InMemoryLessonsRepository()

    sut = new FetchTeacherLessonsHistoryUseCase(
      lessonsRepository,
      teachersRepository,
    )
    vi.useFakeTimers()

    await teachersRepository.create({
      id: 'teacher-01',
      price: 10,
      userId: 'teacher-user-01',
      subjectId: 'subject-01',
      description: '',
      latitude: 0,
      longitude: 0,
    })
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('Should list teacher lessons history', async () => {
    vi.setSystemTime(new Date(2025, 0, 19, 0, 0, 0)) // Sunday, January 19

    await lessonsRepository.create({
      teacherId: 'teacher-01',
      studentId: 'student-user-01',
      startTime: new Date(2025, 0, 19, 7, 0, 0),
      endTime: new Date(2025, 0, 19, 9, 0, 0),
    })
    await lessonsRepository.create({
      teacherId: 'teacher-01',
      studentId: 'student-user-01',
      startTime: new Date(2025, 0, 25, 8, 0, 0),
      endTime: new Date(2025, 0, 25, 12, 0, 0),
    })

    const { lessons } = await sut.execute({
      teacherUserId: 'teacher-user-01',
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

    const minLessonHour = 7

    // Create 10 lessons for student-01
    for (let i = minLessonHour; i < minLessonHour + 10; i++) {
      await lessonsRepository.create({
        teacherId: 'teacher-01',
        studentId: 'student-user-01',
        startTime: new Date(2025, 0, 19, i, 0, 0),
        endTime: new Date(2025, 0, 19, i, 30, 0),
      })
    }
    await lessonsRepository.create({
      teacherId: 'teacher-01',
      studentId: 'student-user-02',
      startTime: new Date(2025, 0, 20, 7, 0, 0),
      endTime: new Date(2025, 0, 20, 7, 30, 0),
    })

    await lessonsRepository.create({
      teacherId: 'teacher-01',
      studentId: 'student-user-02',
      startTime: new Date(2025, 0, 20, 8, 0, 0),
      endTime: new Date(2025, 0, 20, 8, 30, 0),
    })

    const { lessons } = await sut.execute({
      teacherUserId: 'teacher-user-01',
      page: 2,
    })

    expect(lessons).toHaveLength(2)
    expect(lessons).toEqual([
      expect.objectContaining({
        teacherId: 'teacher-01',
        studentId: 'student-user-02',
        id: expect.any(String),
      }),
      expect.objectContaining({
        teacherId: 'teacher-01',
        studentId: 'student-user-02',
        id: expect.any(String),
      }),
    ])
  })
})
