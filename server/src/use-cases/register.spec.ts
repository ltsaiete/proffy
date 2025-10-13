import { compare } from 'bcryptjs'
import { describe, expect, it } from 'vitest'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'
import { RegisterUseCase } from './register'

describe('Register use case', () => {
  it('Should register a user', async () => {
    const usersRepository = new InMemoryUsersRepository()
    const registerUseCase = new RegisterUseCase(usersRepository)

    const { user } = await registerUseCase.execute({
      email: 'johndoe@example.com',
      name: 'John Doe',
      password: '123456',
      latitude: 0,
      longitude: 0,
    })
    expect(user.id).toEqual(expect.any(String))
  })

  it('Should hash user password upon registration', async () => {
    const usersRepository = new InMemoryUsersRepository()
    const registerUseCase = new RegisterUseCase(usersRepository)

    const { user } = await registerUseCase.execute({
      email: 'johndoe@example.com',
      name: 'John Doe',
      password: '123456',
      latitude: 0,
      longitude: 0,
    })

    const isPasswordCorrectlyHashed = await compare('123456', user.passwordHash)

    expect(isPasswordCorrectlyHashed).toBe(true)
  })

  it('Should not be able to register user with the same email twice', async () => {
    const usersRepository = new InMemoryUsersRepository()
    const registerUseCase = new RegisterUseCase(usersRepository)

    await registerUseCase.execute({
      email: 'johndoe@example.com',
      name: 'John Doe',
      password: '123456',
      latitude: 0,
      longitude: 0,
    })

    await expect(() =>
      registerUseCase.execute({
        email: 'johndoe@example.com',
        name: 'John Doe',
        password: '123456',
        latitude: 0,
        longitude: 0,
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })
})
