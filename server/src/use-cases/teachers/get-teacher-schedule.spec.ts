import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryTeacherSchedulesRepository } from '@/repositories/in-memory/in-memory-teacher-schedules-repository'
import { GetTeacherScheduleUseCase } from './get-teacher-schedule'

let teacherSchedulesRepository: InMemoryTeacherSchedulesRepository
let sut: GetTeacherScheduleUseCase

describe('Get teacher schedule use case', () => {
  beforeEach(() => {
    teacherSchedulesRepository = new InMemoryTeacherSchedulesRepository()
    sut = new GetTeacherScheduleUseCase(teacherSchedulesRepository)
  })

  it('Should get a teacher schedule', async () => {
    await teacherSchedulesRepository.createMany([
      {
        teacherId: 'teacher-01',
        weekDay: 0,
        startTime: 420,
        endTime: 1080,
      },
    ])
    await teacherSchedulesRepository.createMany([
      {
        teacherId: 'teacher-02',
        weekDay: 0,
        startTime: 420,
        endTime: 1080,
      },
    ])

    const { schedule } = await sut.execute({
      teacherId: 'teacher-01',
    })

    expect(schedule).toHaveLength(1)
    expect(schedule).toEqual([
      expect.objectContaining({
        teacherId: 'teacher-01',
        id: expect.any(String),
      }),
    ])
  })
})
