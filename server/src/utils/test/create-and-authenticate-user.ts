import { hash } from 'bcryptjs'
import type { FastifyInstance } from 'fastify'
import request from 'supertest'
import { prisma } from '@/lib/prisma'

export async function createAndAuthenticateUser(app: FastifyInstance) {
  await prisma.user.create({
    data: {
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      passwordHash: await hash('123456', 6),
    },
  })

  const authResponse = await request(app.server).post('/sessions').send({
    email: 'johndoe@gmail.com',
    password: '123456',
  })
  const { token } = authResponse.body

  return { token }
}
