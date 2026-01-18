import type { FastifyInstance } from 'fastify'
import { verifyJwt } from '@/http/hooks/verify-jwt'
import { getSchedule } from './get-schedule'
import { nearby } from './nearby'
import { register } from './register'
import { setSchedule } from './set-schedule'
import { updateSchedule } from './update-schedule'

export async function teachersRoutes(app: FastifyInstance) {
  app.get('/teachers/schedule/:teacherId', getSchedule)
  app.get('/teachers/nearby', nearby)
  // app.get('/teachers/subjects/:subjectId', subject)

  // // Authenticated
  app.post('/teachers', { onRequest: [verifyJwt] }, register)
  app.post('/teachers/schedule', { onRequest: [verifyJwt] }, setSchedule)
  app.put('/teachers/schedule', { onRequest: [verifyJwt] }, updateSchedule)
}
