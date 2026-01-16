import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { InMemoryLessonsRepository } from '@/repositories/in-memory/in-memory-lessons-repository'
import { FetchTeacherLessonsUseCase } from './fetch-teacher-lessons'

let lessonsRepository: InMemoryLessonsRepository
let sut: FetchTeacherLessonsUseCase

describe('Fetch teacher lessons use case', () => {
  beforeEach(() => {
    lessonsRepository = new InMemoryLessonsRepository()

    sut = new FetchTeacherLessonsUseCase(lessonsRepository)
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('Should list teacher scheduled lessons for the next week', async () => {
    vi.setSystemTime(new Date(2025, 0, 19, 0, 0, 0)) // Sunday, January 19 2025

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
})
