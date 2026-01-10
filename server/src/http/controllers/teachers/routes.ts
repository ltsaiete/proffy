import type { FastifyInstance } from 'fastify'
import { verifyJwt } from '@/http/hooks/verify-jwt'
import { getSchedule } from './get-schedule'
import { nearby } from './nearby'
import { setSubjectWithSchedule } from './set-subjects-with-schedule'
import { subject } from './subject'
import { updateSchedule } from './update-schedule'

export async function teachersRoutes(app: FastifyInstance) {
  app.get('/teachers/nearby', nearby)
  app.get('/teachers/subjects/:subjectId', subject)
  app.get('/teachers/schedules/:teacherId', getSchedule)

  // Authenticated
  app.post(
    '/teachers/subjects/schedule',
    { onRequest: [verifyJwt] },
    setSubjectWithSchedule,
  )
  app.put('/teachers/schedule', { onRequest: [verifyJwt] }, updateSchedule)
}
