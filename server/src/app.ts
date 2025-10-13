import Fastify from 'fastify'
import { ZodError } from 'zod'
import { env } from './env'
import { appRoutes } from './http/routes'

export const app = Fastify()

app.register(appRoutes)

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
