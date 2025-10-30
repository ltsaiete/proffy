import { compare } from 'bcryptjs'
import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'
import { RegisterUseCase } from './register'

describe('Register use case', () => {
  let usersRepository: InMemoryUsersRepository
  let sut: RegisterUseCase

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new RegisterUseCase(usersRepository)
  })

  it('Should register a user', async () => {
    const { user } = await sut.execute({
      email: 'johndoe@example.com',
      name: 'John Doe',
      password: '123456',
    })
    expect(user.id).toEqual(expect.any(String))
  })

  it('Should hash user password upon registration', async () => {
    const { user } = await sut.execute({
      email: 'johndoe@example.com',
      name: 'John Doe',
      password: '123456',
    })

    const isPasswordCorrectlyHashed = await compare('123456', user.passwordHash)

    expect(isPasswordCorrectlyHashed).toBe(true)
  })

  it('Should not be able to register user with the same email twice', async () => {
    await sut.execute({
      email: 'johndoe@example.com',
      name: 'John Doe',
      password: '123456',
    })

    await expect(() =>
      sut.execute({
        email: 'johndoe@example.com',
        name: 'John Doe',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })
})
