import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { InMemoryLessonsRepository } from '@/repositories/in-memory/in-memory-lessons-repository'
import { FetchStudentLessonsUseCase } from './fetch-student-lessons'

describe('Fetch student lessons use case', () => {
  let lessonsRepository: InMemoryLessonsRepository
  let sut: FetchStudentLessonsUseCase

  beforeEach(() => {
    lessonsRepository = new InMemoryLessonsRepository()
    sut = new FetchStudentLessonsUseCase(lessonsRepository)
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('Should list student scheduled lessons for the next week', async () => {
    vi.setSystemTime(new Date(2025, 0, 19, 0, 0, 0)) // Sunday, January 19

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

    await lessonsRepository.create({
      teacherId: 'teacher-01',
      studentId: 'student-01',
      startTime: new Date(2025, 0, 26, 8, 0, 0),
      endTime: new Date(2025, 0, 26, 12, 0, 0),
    })

    const { lessons } = await sut.execute({
      studentId: 'student-01',
    })

    expect(lessons).toHaveLength(2)
    expect(lessons).toEqual([
      expect.objectContaining({
        studentId: 'student-01',
        id: expect.any(String),
      }),
      expect.objectContaining({
        studentId: 'student-01',
        id: expect.any(String),
      }),
    ])
  })
})
