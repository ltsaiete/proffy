import type { FastifyReply, FastifyRequest } from 'fastify'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error'
import { makeGetUserProfileUseCase } from '@/use-cases/users/factories/make-get-user-profile-use-case'

export async function profile(request: FastifyRequest, reply: FastifyReply) {
  const getUserProfileUseCase = makeGetUserProfileUseCase()
  try {
    const { user } = await getUserProfileUseCase.execute({
      userId: request.user.sub,
    })
    return reply
      .status(200)
      .send({ user: { ...user, passwordHash: undefined } })
  } catch (error) {
    if (error instanceof ResourceNotFoundError)
      return reply.status(404).send({ message: error.message })

    throw error
  }
}
