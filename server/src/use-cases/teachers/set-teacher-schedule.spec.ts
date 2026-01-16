import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryTeacherSchedulesRepository } from '@/repositories/in-memory/in-memory-teacher-schedules-repository'
import { InMemoryTeachersRepository } from '@/repositories/in-memory/in-memory-teachers-repository'
import { OnlyOneClassPerDayAllowedError } from '../errors/only-one-class-per-day-allowed-error'
import { ScheduleTimeOutOfRangeError } from '../errors/schedule-time-out-of-range-error'
import { UserNotTeacherError } from '../errors/user-not-teacher-error'
import { SetTeacherScheduleUseCase } from './set-teacher-schedule'

let teachersRepository: InMemoryTeachersRepository
let teacherSchedulesRepository: InMemoryTeacherSchedulesRepository
let sut: SetTeacherScheduleUseCase

describe('Set teacher schedule use case', () => {
  beforeEach(async () => {
    teacherSchedulesRepository = new InMemoryTeacherSchedulesRepository()
    teachersRepository = new InMemoryTeachersRepository({})
    sut = new SetTeacherScheduleUseCase(
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
  })

  it('Should set teacher schedule', async () => {
    const { scheduleCount } = await sut.execute({
      teacherUserId: 'user-01',
      schedule: [
        {
          weekDay: 0,
          startTime: 420,
          endTime: 1080,
        },
      ],
    })
    expect(scheduleCount).toEqual(1)

    const schedules =
      await teacherSchedulesRepository.findManyByTeacherId('teacher-01')

    expect(schedules).toHaveLength(1)
    expect(schedules).toEqual([
      expect.objectContaining({
        teacherId: 'teacher-01',
        id: expect.any(String),
      }),
    ])
  })

  it('Should not allow a user to set a schedule when he is not registered as teacher', async () => {
    await expect(() =>
      sut.execute({
        teacherUserId: 'user-02',
        schedule: [
          {
            weekDay: 0,
            startTime: 420,
            endTime: 1080,
          },
        ],
      }),
    ).rejects.toBeInstanceOf(UserNotTeacherError)
  })

  it('Should not allow a teacher to schedule a class out of 7AM to 6PM range', async () => {
    await expect(() =>
      sut.execute({
        teacherUserId: 'user-01',
        schedule: [
          {
            weekDay: 0,
            startTime: 419,
            endTime: 1080,
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
