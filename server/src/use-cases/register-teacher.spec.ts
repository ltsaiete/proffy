import { beforeEach, describe, expect, it } from 'vitest'
import { InMemorySubjectsRepository } from '@/repositories/in-memory/in-memory-subjects-repository'
import { InMemoryTeachersRepository } from '@/repositories/in-memory/in-memory-teachers-repository'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import type { SubjectsRepository } from '@/repositories/subjects-repository'
import type { TeachersRepository } from '@/repositories/teachers-repository'
import type { UsersRepository } from '@/repositories/users-repository'
import { TeacherAlreadyHasSubjectAssignedError } from './errors/teacher-already-has-subject-assigned-error'
import { RegisterTeacherUseCase } from './register-teacher'

describe('Register Teacher use case', () => {
  let teachersRepository: TeachersRepository
  let usersRepository: UsersRepository
  let subjectsRepository: SubjectsRepository
  let sut: RegisterTeacherUseCase

  beforeEach(async () => {
    usersRepository = new InMemoryUsersRepository()
    subjectsRepository = new InMemorySubjectsRepository()
    teachersRepository = new InMemoryTeachersRepository({})
    sut = new RegisterTeacherUseCase(teachersRepository)

    await usersRepository.create({
      id: 'user-01',
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      passwordHash: '123456',
    })

    await subjectsRepository.create({
      id: 'subject-01',
      name: 'Maths',
    })
  })

  it('should register a user as teacher', async () => {
    const { teacher } = await sut.execute({
      userId: 'user-01',
      subjectId: 'subject-01',
      description: 'teacher',
      latitude: 0,
      longitude: 0,
      price: 10,
    })

    expect(teacher.id).toEqual(expect.any(String))
  })

  it('should not allow to register as teacher a user that is already a teacher', async () => {
    await sut.execute({
      userId: 'user-01',
      subjectId: 'subject-01',
      description: 'teacher',
      latitude: 0,
      longitude: 0,
      price: 10,
    })

    await expect(() =>
      sut.execute({
        userId: 'user-01',
        subjectId: 'subject-01',
        description: 'teacher',
        latitude: 0,
        longitude: 0,
        price: 10,
      }),
    ).rejects.toBeInstanceOf(TeacherAlreadyHasSubjectAssignedError)
  })
})
