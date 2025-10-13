import type { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'
import { registerUseCase } from '@/use-cases/register'

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

  try {
    await registerUseCase({ email, latitude, longitude, name, password })
  } catch (error) {
    console.log(error)
    return reply.status(409).send(error)
  }

  return reply.status(201).send()
}
