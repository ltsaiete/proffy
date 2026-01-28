import fastifyJwt from '@fastify/jwt'
import Fastify from 'fastify'
import { ZodError } from 'zod'
import { env } from './env'
import { lessonsRoutes } from './http/controllers/lessons/routes'
import { subjectsRoutes } from './http/controllers/subjects/routes'
import { teachersRoutes } from './http/controllers/teachers/routes'
import { usersRoutes } from './http/controllers/users/routes'

export const app = Fastify()

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
  sign: {
    expiresIn: '1h',
  },
})

app.register(usersRoutes)
app.register(teachersRoutes)
app.register(lessonsRoutes)
app.register(subjectsRoutes)

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
