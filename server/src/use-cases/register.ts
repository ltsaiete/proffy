import { hash } from 'bcryptjs'
import type { UsersRepository } from '@/repositories/users-repository'

interface RegisterUseCaseParams {
  name: string
  email: string
  password: string
  latitude: number
  longitude: number
}

export class RegisterUseCase {
  constructor(private repository: UsersRepository) {}

  async execute({
    name,
    email,
    password,
    latitude,
    longitude,
  }: RegisterUseCaseParams) {
    const userWithSameEmail = await this.repository.findByEmail(email)

    if (userWithSameEmail) throw new Error('User already exists')

    const passwordHash = await hash(password, 6)

    const user = await this.repository.create({
      name,
      email,
      passwordHash,
      latitude,
      longitude,
    })

    return { user }
  }
}
