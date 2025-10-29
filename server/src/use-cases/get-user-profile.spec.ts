import { hash } from 'bcryptjs'
import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { GetUserProfileUseCase } from './get-user-profile'

let usersRepository: InMemoryUsersRepository
let sut: GetUserProfileUseCase

describe('Get user profile use case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new GetUserProfileUseCase(usersRepository)
  })

  it('should get user profile', async () => {
    await usersRepository.create({
      id: 'user-01',
      name: 'John Doe',
      email: 'johndoe@example.com',
      passwordHash: await hash('123456', 6),
    })

    const { user } = await sut.execute({
      userId: 'user-01',
    })

    expect(user.id).toEqual('user-01')
  })

  it('should not be able to profile of a non existent user', async () => {
    await expect(() =>
      sut.execute({
        userId: 'non-existent',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
