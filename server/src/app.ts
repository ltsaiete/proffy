import Fastify from 'fastify'

export const app = Fastify()

app.get('/', (request, reply) => {
  return reply.send({ message: 'Hello world' })
})
