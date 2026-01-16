import { hash } from 'bcryptjs'
import type { User } from 'generated/prisma'
import type { UsersRepository } from '@/repositories/users-repository'
import { UserAlreadyExistsError } from '../errors/user-already-exists-error'

interface RegisterUseCaseParams {
  name: string
  email: string
  password: string
}

interface RegisterUseCaseResponse {
  user: User
}

export class RegisterUseCase {
  constructor(private repository: UsersRepository) {}

  async execute({
    name,
    email,
    password,
  }: RegisterUseCaseParams): Promise<RegisterUseCaseResponse> {
    const userWithSameEmail = await this.repository.findByEmail(email)

    if (userWithSameEmail) throw new UserAlreadyExistsError()

    const passwordHash = await hash(password, 6)

    const user = await this.repository.create({
      name,
      email,
      passwordHash,
    })

    return { user }
  }
}
