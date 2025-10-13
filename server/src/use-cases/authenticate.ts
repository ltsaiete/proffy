import { compare } from 'bcryptjs'
import type { UsersRepository } from '@/repositories/users-repository'
import { InvalidCredentialsError } from './errors/invalid-credentials-error'

interface AuthenticateUseCaseParams {
  email: string
  password: string
}

export class AuthenticateUseCase {
  constructor(private repository: UsersRepository) {}

  async execute({ email, password }: AuthenticateUseCaseParams) {
    const user = await this.repository.findByEmail(email)

    if (!user) throw new InvalidCredentialsError()

    const doesPasswordMatch = await compare(password, user.passwordHash)

    if (!doesPasswordMatch) throw new InvalidCredentialsError()

    return { user }
  }
}
