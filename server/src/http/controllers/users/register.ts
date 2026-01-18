import type { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'
import { UserAlreadyExistsError } from '@/use-cases/errors/user-already-exists-error'
import { makeRegisterUseCase } from '@/use-cases/users/factories/make-register-use-case'

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const registerBodySchema = z.object({
    name: z.string(),
    email: z.string(),
    password: z.string(),
  })
  const { email, name, password } = registerBodySchema.parse(request.body)
  const registerUseCase = makeRegisterUseCase()

  try {
    await registerUseCase.execute({
      email,
      name,
      password,
    })
  } catch (error) {
    if (error instanceof UserAlreadyExistsError)
      return reply.status(409).send({ message: error.message })

    throw error
  }

  return reply.status(201).send()
}
