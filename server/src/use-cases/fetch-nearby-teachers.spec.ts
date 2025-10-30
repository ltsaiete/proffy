import { hash } from 'bcryptjs'
import { beforeEach, describe, expect, it } from 'vitest'
import { InMemorySubjectsRepository } from '@/repositories/in-memory/in-memory-subjects-repository'
import { InMemoryTeacherSchedulesRepository } from '@/repositories/in-memory/in-memory-teacher-schedules-repository'
import { InMemoryTeachersRepository } from '@/repositories/in-memory/in-memory-teachers-repository'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { FetchNearbyTeachersUseCase } from './fetch-nearby-teachers'

describe('Fetch teachers by subject use case', () => {
  let teachersRepository: InMemoryTeachersRepository
  let usersRepository: InMemoryUsersRepository
  let subjectsRepository: InMemorySubjectsRepository
  let teacherSchedulesRepository: InMemoryTeacherSchedulesRepository
  let sut: FetchNearbyTeachersUseCase

  beforeEach(() => {
    teacherSchedulesRepository = new InMemoryTeacherSchedulesRepository()
    usersRepository = new InMemoryUsersRepository()
    subjectsRepository = new InMemorySubjectsRepository()
    teachersRepository = new InMemoryTeachersRepository({
      inMemoryTeacherSchedulesRepository: teacherSchedulesRepository,
      inMemoryUsersRepository: usersRepository,
      inMemorySubjectsRepository: subjectsRepository,
    })
    sut = new FetchNearbyTeachersUseCase(teachersRepository)
  })

  it('Should be able fetch nearby teachers ', async () => {
    const nearTeacherUser = await usersRepository.create({
      name: 'Near Teacher',
      email: 'nearteacher@example.com',
      passwordHash: await hash('123456', 6),
    })

    const farTeacherUser = await usersRepository.create({
      name: 'Far Teacher',
      email: 'farteacher@example.com',
      passwordHash: await hash('123456', 6),
    })

    const subject = await subjectsRepository.create({
      name: 'Maths',
    })

    await teachersRepository.createWithSchedule({
      teacher: {
        price: 10,
        userId: nearTeacherUser.id,
        subjectId: subject.id,
        description: 'Near teacher',
        latitude: -25.8878476200255,
        longitude: 32.44430071970727,
      },
      schedule: [],
    })

    await teachersRepository.createWithSchedule({
      teacher: {
        price: 10,
        userId: farTeacherUser.id,
        subjectId: subject.id,
        description: 'Far teacher',
        latitude: -25.75813186699103,
        longitude: 32.67643598129227,
      },
      schedule: [],
    })

    const { teachers } = await sut.execute({
      userLatitude: -25.891959386430337,
      userLongitude: 32.434172698501754,
    })

    expect(teachers).toHaveLength(1)
    expect(teachers).toEqual([
      expect.objectContaining({
        id: expect.any(String),
        description: 'Near teacher',
        user: expect.objectContaining({
          id: expect.any(String),
          name: 'Near Teacher',
        }),
      }),
    ])
  })
})
