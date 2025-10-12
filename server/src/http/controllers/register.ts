import type { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'
import { prisma } from '@/lib/prisma'

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

  await prisma.user.create({
    data: {
      name,
      email,
      passwordHash: password,
      latitude,
      longitude,
    },
  })

  return reply.status(201).send()
}
