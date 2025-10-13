import type { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { RegisterUseCase } from '@/use-cases/register'

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const registerBodySchema = z.object({
    name: z.string(),
    email: z.string(),
    password: z.string(),
    latitude: z.number(),
    longitude: z.number(),
  })
  const { email, latitude, longitude, name, password } =
    registerBodySchema.parse(request.body)

  const usersRepository = new PrismaUsersRepository()
  const registerUseCase = new RegisterUseCase(usersRepository)

  try {
    await registerUseCase.execute({
      email,
      latitude,
      longitude,
      name,
      password,
    })
  } catch (error) {
    return reply.status(409).send(error)
  }

  return reply.status(201).send()
}
