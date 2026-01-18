import fastifyJwt from '@fastify/jwt'
import Fastify from 'fastify'
import { ZodError } from 'zod'
import { env } from './env'
import { teachersRoutes } from './http/controllers/teachers/routes'
import { usersRoutes } from './http/controllers/users/routes'
import { prisma } from './lib/prisma'
import { PrismaTeachersRepository } from './repositories/prisma/prisma-teachers-repository'

export const app = Fastify()

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
  sign: {
    expiresIn: '1h',
  },
})

app.register(usersRoutes)
app.register(teachersRoutes)
// app.register(lessonsRoutes)
// app.register(subjectsRoutes)

app.setErrorHandler((error, _, reply) => {
  if (error instanceof ZodError)
    return reply
      .status(400)
      .send({ message: 'Validation error.', issues: error.issues })

  if (env.NODE_ENV === 'production' || env.NODE_ENV === 'development')
    console.error(error)
  // else TODO: Log to an external tool

  return reply.status(500).send({
    message: 'Internal server error',
  })
})

async function run() {
  const repo = new PrismaTeachersRepository()
  const res = await repo.findManyNearby({
    latitude: -25.891959386430337,
    longitude: 32.434172698501754,
  })
  console.log(res)

  // const nearUser = await prisma.user.create({
  //   data: {
  //     name: 'Near teacher',
  //     email: 'near@example.com',
  //     passwordHash: '123456',
  //   },
  // })
  // const farUser = await prisma.user.create({
  //   data: {
  //     name: 'Far teacher',
  //     email: 'far@example.com',
  //     passwordHash: '123456',
  //   },
  // })

  // const subject = await prisma.subject.create({
  //   data: {
  //     name: 'Maths',
  //   },
  // })

  // await prisma.teacher.create({
  //   data: {
  //     price: 10,
  //     latitude: -25.8878476200255,
  //     longitude: 32.44430071970727,
  //     userId: nearUser.id,
  //     subjectId: subject.id,
  //   },
  // })
  // await prisma.teacher.create({
  //   data: {
  //     price: 10,
  //     latitude: -25.75813186699103,
  //     longitude: 32.67643598129227,
  //     userId: farUser.id,
  //     subjectId: subject.id,
  //   },
  // })
}

run().then(() => {
  console.log('Finished running')
})
