import type { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { InvalidCredentialsError } from '@/use-cases/errors/invalid-credentials-error'
import { makeAuthenticateUseCase } from '@/use-cases/factories/make-authenticate-use-case'

export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const authenticateBodySchema = z.object({
    email: z.string(),
    password: z.string(),
  })

  const { email, password } = authenticateBodySchema.parse(request.body)

  try {
    const authenticateUseCase = makeAuthenticateUseCase()
    const { user } = await authenticateUseCase.execute({ email, password })

    return reply
      .status(200)
      .send({ user: { ...user, passwordHash: undefined } })
  } catch (error) {
    if (error instanceof InvalidCredentialsError)
      return reply.status(400).send({ message: error.message })
  }
}
