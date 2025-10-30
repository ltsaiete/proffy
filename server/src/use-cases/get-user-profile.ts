import type { User } from 'generated/prisma'
import type { UsersRepository } from '@/repositories/users-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

interface GetUserProfileUseCaseParams {
  userId: string
}

interface GetUserProfileUseCaseResponse {
  user: User
}

export class GetUserProfileUseCase {
  constructor(private repository: UsersRepository) {}

  async execute({
    userId,
  }: GetUserProfileUseCaseParams): Promise<GetUserProfileUseCaseResponse> {
    const user = await this.repository.findById(userId)

    if (!user) throw new ResourceNotFoundError('User')

    return { user }
  }
}
