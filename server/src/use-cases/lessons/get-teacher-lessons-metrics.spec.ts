import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryLessonsRepository } from '@/repositories/in-memory/in-memory-lessons-repository'
import { InMemoryTeachersRepository } from '@/repositories/in-memory/in-memory-teachers-repository'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'
import { GetTeacherLessonsMetricsUseCase } from './get-teacher-lessons-metrics'

describe('Get teacher lessons metrics use case', () => {
  let teachersRepository: InMemoryTeachersRepository
  let lessonsRepository: InMemoryLessonsRepository
  let sut: GetTeacherLessonsMetricsUseCase

  beforeEach(() => {
    teachersRepository = new InMemoryTeachersRepository()
    lessonsRepository = new InMemoryLessonsRepository()

    sut = new GetTeacherLessonsMetricsUseCase(
      lessonsRepository,
      teachersRepository,
    )
  })

  it('Should get teacher lessons count', async () => {
    await teachersRepository.create({
      id: 'teacher-01',
      price: 10,
      userId: 'teacher-user-01',
      subjectId: 'subject-01',
      description: '',
      latitude: 0,
      longitude: 0,
    })

    await lessonsRepository.create({
      teacherId: 'teacher-01',
      studentId: 'student-01',
      startTime: new Date(2025, 0, 19, 9, 0, 0),
      endTime: new Date(2025, 0, 19, 9, 30, 0),
    })
    await lessonsRepository.create({
      teacherId: 'teacher-01',
      studentId: 'student-01',
      startTime: new Date(2025, 0, 19, 10, 0, 0),
      endTime: new Date(2025, 0, 19, 10, 30, 0),
    })

    const { lessonsCount } = await sut.execute({
      teacherUserId: 'teacher-user-01',
    })

    expect(lessonsCount).toEqual(2)
  })

  it('Should not allow a user that is not a teacher to get lessons count', async () => {
    await lessonsRepository.create({
      teacherId: 'teacher-01',
      studentId: 'student-01',
      startTime: new Date(2025, 0, 19, 9, 0, 0),
      endTime: new Date(2025, 0, 19, 9, 30, 0),
    })

    await expect(() =>
      sut.execute({
        teacherUserId: 'teacher-user-02',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
