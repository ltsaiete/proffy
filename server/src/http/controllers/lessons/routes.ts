import type { FastifyInstance } from 'fastify'
import { verifyJwt } from '@/http/hooks/verify-jwt'
import { details } from './details'
import { schedule } from './schedule'
import { student } from './student'
import { teacher } from './teacher'
import { teacherHistory } from './teacher-history'
import { teacherMetrics } from './teacher-metrics'

export async function lessonsRoutes(app: FastifyInstance) {
  app.get('/lessons/:id', { onRequest: [verifyJwt] }, details)
  app.post('/lessons', { onRequest: [verifyJwt] }, schedule)
  app.get('/lessons/students', { onRequest: [verifyJwt] }, student)
  app.get(
    '/lessons/teachers/history',
    { onRequest: [verifyJwt] },
    teacherHistory,
  )
  app.get(
    '/lessons/teachers/metrics',
    { onRequest: [verifyJwt] },
    teacherMetrics,
  )
  app.get('/lessons/teachers/:teacherId', teacher)
}
