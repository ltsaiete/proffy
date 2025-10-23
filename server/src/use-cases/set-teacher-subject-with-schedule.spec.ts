import { hash } from 'bcryptjs'
import { beforeEach, describe, expect, it } from 'vitest'
import { InMemorySubjectsRepository } from '@/repositories/in-memory/in-memory-subjects-repository'
import { InMemoryTeacherSchedulesRepository } from '@/repositories/in-memory/in-memory-teacher-schedules-repository'
import { InMemoryTeachersRepository } from '@/repositories/in-memory/in-memory-teachers-repository'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { OnlyOneClassPerDayAllowedError } from './errors/only-one-class-per-day-allowed-error'
import { ScheduleTimeOutOfRangeError } from './errors/schedule-time-out-of-range-error'
import { TeacherAlreadyHasSubjectAssignedError } from './errors/teacher-already-has-subject-assigned-error'
import { SetTeacherSubjectWithScheduleUseCase } from './set-teacher-subject-with-schedule'

describe('Set teacher subject with schedule use case', () => {
  let teachersRepository: InMemoryTeachersRepository
  let usersRepository: InMemoryUsersRepository
  let subjectsRepository: InMemorySubjectsRepository
  let teacherSchedulesRepository: InMemoryTeacherSchedulesRepository
  let sut: SetTeacherSubjectWithScheduleUseCase

  beforeEach(() => {
    teacherSchedulesRepository = new InMemoryTeacherSchedulesRepository()
    teachersRepository = new InMemoryTeachersRepository({
      inMemoryTeacherSchedulesRepository: teacherSchedulesRepository,
    })
    usersRepository = new InMemoryUsersRepository()
    subjectsRepository = new InMemorySubjectsRepository()
    sut = new SetTeacherSubjectWithScheduleUseCase(teachersRepository)
  })

  it('Should set teacher subject with schedule', async () => {
    const user = await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      passwordHash: await hash('123456', 6),
    })

    const subject = await subjectsRepository.create({
      name: 'Maths',
    })

    const { teacher } = await sut.execute({
      price: 10,
      userId: user.id,
      subjectId: subject.id,
      description: '',
      latitude: 0,
      longitude: 0,
      schedule: [
        {
          weekDay: 0,
          startTime: 420,
          endTime: 1080,
        },
      ],
    })
    expect(teacher.id).toEqual(expect.any(String))

    const teacherSchedules =
      await teacherSchedulesRepository.findManyByTeacherId(teacher.id)

    // console.log(teacherSchedules)

    expect(teacherSchedules).toHaveLength(1)
    expect(teacherSchedules).toEqual([
      expect.objectContaining({
        teacherId: teacher.id,
        id: expect.any(String),
      }),
    ])
  })

  it('Should not allow a teacher to associate to more than one subject', async () => {
    const user = await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      passwordHash: await hash('123456', 6),
    })

    let subject = await subjectsRepository.create({
      name: 'Maths',
    })

    await sut.execute({
      price: 10,
      userId: user.id,
      subjectId: subject.id,
      description: '',
      latitude: 0,
      longitude: 0,
      schedule: [
        {
          weekDay: 0,
          startTime: 420,
          endTime: 1080,
        },
      ],
    })

    subject = await subjectsRepository.create({
      name: 'Physics',
    })

    await expect(() =>
      sut.execute({
        price: 10,
        userId: user.id,
        subjectId: subject.id,
        description: '',
        latitude: 0,
        longitude: 0,
        schedule: [
          {
            weekDay: 0,
            startTime: 420,
            endTime: 1080,
          },
        ],
      }),
    ).rejects.toBeInstanceOf(TeacherAlreadyHasSubjectAssignedError)
  })

  it('Should not allow a teacher to schedule a class out of 7AM to 6PM range', async () => {
    const user = await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      passwordHash: await hash('123456', 6),
    })

    const subject = await subjectsRepository.create({
      name: 'Maths',
    })

    await expect(() =>
      sut.execute({
        price: 10,
        userId: user.id,
        subjectId: subject.id,
        description: '',
        latitude: 0,
        longitude: 0,
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
        price: 10,
        userId: user.id,
        subjectId: subject.id,
        description: '',
        latitude: 0,
        longitude: 0,
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
    const user = await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      passwordHash: await hash('123456', 6),
    })

    const subject = await subjectsRepository.create({
      name: 'Maths',
    })

    await expect(() =>
      sut.execute({
        price: 10,
        userId: user.id,
        subjectId: subject.id,
        description: '',
        latitude: 0,
        longitude: 0,
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
// days above 7
