import { beforeEach, describe, expect, it } from 'vitest'
import { InMemorySubjectsRepository } from '@/repositories/in-memory/in-memory-subjects-repository'
import { InMemoryTeachersRepository } from '@/repositories/in-memory/in-memory-teachers-repository'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { FetchTeachersBySubjectUseCase } from './fetch-teachers-by-subject'

describe('Fetch teachers by subject use case', () => {
  let teachersRepository: InMemoryTeachersRepository
  let usersRepository: InMemoryUsersRepository
  let subjectsRepository: InMemorySubjectsRepository
  let sut: FetchTeachersBySubjectUseCase

  beforeEach(async () => {
    usersRepository = new InMemoryUsersRepository()
    subjectsRepository = new InMemorySubjectsRepository()
    teachersRepository = new InMemoryTeachersRepository({
      inMemoryUsersRepository: usersRepository,
      inMemorySubjectsRepository: subjectsRepository,
    })
    sut = new FetchTeachersBySubjectUseCase(teachersRepository)

    await subjectsRepository.create({
      id: 'subject-01',
      name: 'Maths',
    })

    await subjectsRepository.create({
      id: 'subject-02',
      name: 'Physics',
    })
  })

  it('Should fetch teachers list by subject', async () => {
    await usersRepository.create({
      id: 'teacher-user-01',
      name: 'Teacher 1',
      email: 'teacher1@example.com',
      passwordHash: '123456',
    })

    await usersRepository.create({
      id: 'teacher-user-01',
      name: 'Teacher 2',
      email: 'teacher2@example.com',
      passwordHash: '123456',
    })

    await teachersRepository.create({
      id: 'teacher-01',
      price: 10,
      userId: 'teacher-user-01',
      subjectId: 'subject-01',
      description: 'Maths teacher',
      latitude: 0,
      longitude: 0,
    })

    await teachersRepository.create({
      id: 'teacher-02',
      price: 10,
      userId: 'teacher-user-02',
      subjectId: 'subject-02',
      description: 'Physics teacher',
      latitude: 0,
      longitude: 0,
    })

    const { teachers } = await sut.execute({
      subjectId: 'subject-01',
      page: 1,
    })

    expect(teachers).toHaveLength(1)
    expect(teachers).toEqual([
      expect.objectContaining({
        id: 'teacher-01',
        description: 'Maths teacher',
        user: expect.objectContaining({
          id: 'teacher-user-01',
        }),
        subject: expect.objectContaining({
          id: 'subject-01',
          name: 'Maths',
        }),
      }),
    ])
  })

  it('Should allow to fetch paginated teachers', async () => {
    for (let i = 1; i <= 12; i++) {
      await usersRepository.create({
        id: `user-${i}`,
        name: `User ${i}`,
        email: `user${i}@example.com`,
        passwordHash: '123456',
      })

      await teachersRepository.create({
        id: `teacher-${i}`,
        price: 10,
        userId: `user-${i}`,
        subjectId: 'subject-01',
        description: `Teacher ${i}`,
        latitude: 0,
        longitude: 0,
      })
    }

    const { teachers } = await sut.execute({
      subjectId: 'subject-01',
      page: 2,
    })

    expect(teachers).toHaveLength(2)
    expect(teachers).toEqual([
      expect.objectContaining({
        id: 'teacher-11',
        description: 'Teacher 11',
      }),
      expect.objectContaining({
        id: 'teacher-12',
        description: 'Teacher 12',
      }),
    ])
  })
})
