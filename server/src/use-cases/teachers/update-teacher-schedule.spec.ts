import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryTeacherSchedulesRepository } from '@/repositories/in-memory/in-memory-teacher-schedules-repository'
import { InMemoryTeachersRepository } from '@/repositories/in-memory/in-memory-teachers-repository'
import { OnlyOneClassPerDayAllowedError } from '../errors/only-one-class-per-day-allowed-error'
import { ScheduleTimeOutOfRangeError } from '../errors/schedule-time-out-of-range-error'
import { UpdateTeacherScheduleUseCase } from './update-teacher-schedule'

let teachersRepository: InMemoryTeachersRepository
let teacherSchedulesRepository: InMemoryTeacherSchedulesRepository
let sut: UpdateTeacherScheduleUseCase

describe('Update teacher schedule use case', () => {
  beforeEach(async () => {
    teacherSchedulesRepository = new InMemoryTeacherSchedulesRepository()
    teachersRepository = new InMemoryTeachersRepository()
    sut = new UpdateTeacherScheduleUseCase(
      teacherSchedulesRepository,
      teachersRepository,
    )

    await teachersRepository.create({
      id: 'teacher-01',
      price: 10,
      userId: 'user-01',
      subjectId: 'subject-01',
      description: '',
      latitude: 0,
      longitude: 0,
    })

    await teacherSchedulesRepository.createMany([
      {
        id: 'schedule-01',
        teacherId: 'teacher-01',
        weekDay: 0,
        startTime: 420,
        endTime: 1080,
      },
    ])
  })

  it('Should update a teacher schedule', async () => {
    const { schedule } = await sut.execute({
      teacherUserId: 'user-01',
      schedule: [
        {
          weekDay: 0,
          startTime: 420,
          endTime: 720,
        },
        {
          weekDay: 1,
          startTime: 420,
          endTime: 1080,
        },
      ],
    })

    expect(schedule).toHaveLength(2)
    expect(schedule).toEqual([
      expect.objectContaining({
        teacherId: 'teacher-01',
        id: expect.any(String),
        startTime: 420,
        endTime: 720,
      }),
      expect.objectContaining({
        teacherId: 'teacher-01',
        id: expect.any(String),
      }),
    ])
    await expect(
      teacherSchedulesRepository.findManyByTeacherId('teacher-01'),
    ).resolves.toHaveLength(2)
  })

  it('Should not allow a teacher to schedule a class out of 7AM to 6PM range', async () => {
    await expect(() =>
      sut.execute({
        teacherUserId: 'user-01',
        schedule: [
          {
            weekDay: 0,
            startTime: 419,
            endTime: 720,
          },
        ],
      }),
    ).rejects.toBeInstanceOf(ScheduleTimeOutOfRangeError)

    await expect(() =>
      sut.execute({
        teacherUserId: 'user-01',
        schedule: [
          {
            weekDay: 0,
            startTime: 420,
            endTime: 1081,
          },
        ],
      }),
    ).rejects.toBeInstanceOf(ScheduleTimeOutOfRangeError)
  })

  it('Should not allow a teacher to schedule more than one class for the same day', async () => {
    await expect(() =>
      sut.execute({
        teacherUserId: 'user-01',
        schedule: [
          {
            weekDay: 0,
            startTime: 420,
            endTime: 720,
          },
          {
            weekDay: 0,
            startTime: 780,
            endTime: 1080,
          },
        ],
      }),
    ).rejects.toBeInstanceOf(OnlyOneClassPerDayAllowedError)
  })
})
