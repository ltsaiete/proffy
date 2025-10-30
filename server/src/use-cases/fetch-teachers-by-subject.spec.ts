import { hash } from 'bcryptjs'
import { beforeEach, describe, expect, it } from 'vitest'
import { InMemorySubjectsRepository } from '@/repositories/in-memory/in-memory-subjects-repository'
import { InMemoryTeacherSchedulesRepository } from '@/repositories/in-memory/in-memory-teacher-schedules-repository'
import { InMemoryTeachersRepository } from '@/repositories/in-memory/in-memory-teachers-repository'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { OnlyOneClassPerDayAllowedError } from './errors/only-one-class-per-day-allowed-error'
import { ScheduleTimeOutOfRangeError } from './errors/schedule-time-out-of-range-error'
import { FetchTeachersBySubjectUseCase } from './fetch-teachers-by-subject'
import { UpdateTeacherScheduleUseCase } from './update-teacher-schedule'

describe('Fetch teachers by subject use case', () => {
  let teachersRepository: InMemoryTeachersRepository
  let usersRepository: InMemoryUsersRepository
  let subjectsRepository: InMemorySubjectsRepository
  let teacherSchedulesRepository: InMemoryTeacherSchedulesRepository
  let sut: FetchTeachersBySubjectUseCase

  beforeEach(() => {
    teacherSchedulesRepository = new InMemoryTeacherSchedulesRepository()
    usersRepository = new InMemoryUsersRepository()
    subjectsRepository = new InMemorySubjectsRepository()
    teachersRepository = new InMemoryTeachersRepository({
      inMemoryTeacherSchedulesRepository: teacherSchedulesRepository,
      inMemoryUsersRepository: usersRepository,
      inMemorySubjectsRepository: subjectsRepository,
    })
    sut = new FetchTeachersBySubjectUseCase(teachersRepository)
  })

  it('Should fetch teachers list by subject', async () => {
    const user1 = await usersRepository.create({
      name: 'User 1',
      email: 'user1@example.com',
      passwordHash: await hash('123456', 6),
    })

    const user2 = await usersRepository.create({
      name: 'User 2',
      email: 'user2@example.com',
      passwordHash: await hash('123456', 6),
    })

    const mathsSubject = await subjectsRepository.create({
      name: 'Maths',
    })
    const physicsSubject = await subjectsRepository.create({
      name: 'Physics',
    })

    await teachersRepository.createWithSchedule({
      teacher: {
        price: 10,
        userId: user1.id,
        subjectId: mathsSubject.id,
        description: 'Maths teacher',
        latitude: 0,
        longitude: 0,
      },
      schedule: [],
    })

    await teachersRepository.createWithSchedule({
      teacher: {
        price: 10,
        userId: user2.id,
        subjectId: physicsSubject.id,
        description: 'Physics teacher',
        latitude: 0,
        longitude: 0,
      },
      schedule: [],
    })

    const { teachers } = await sut.execute({
      subjectId: mathsSubject.id,
      page: 1,
    })

    expect(teachers).toHaveLength(1)
    expect(teachers).toEqual([
      expect.objectContaining({
        id: expect.any(String),
        description: 'Maths teacher',
        user: expect.objectContaining({
          id: expect.any(String),
          name: 'User 1',
        }),
        subject: expect.objectContaining({
          id: expect.any(String),
          name: 'Maths',
        }),
      }),
    ])
  })

  it('Should allow to fetch paginated teachers', async () => {
    const subject = await subjectsRepository.create({
      name: 'Maths',
    })

    for (let i = 1; i <= 12; i++) {
      const user = await usersRepository.create({
        name: `User ${i}`,
        email: `user${i}@example.com`,
        passwordHash: await hash('123456', 6),
      })

      await teachersRepository.createWithSchedule({
        teacher: {
          price: 10,
          userId: user.id,
          subjectId: subject.id,
          description: `Teacher ${i}`,
          latitude: 0,
          longitude: 0,
        },
        schedule: [],
      })
    }

    const { teachers } = await sut.execute({
      subjectId: subject.id,
      page: 2,
    })

    expect(teachers).toHaveLength(2)
    expect(teachers).toEqual([
      expect.objectContaining({
        id: expect.any(String),
        description: 'Teacher 11',
      }),
      expect.objectContaining({
        id: expect.any(String),
        description: 'Teacher 12',
      }),
    ])
  })
})
