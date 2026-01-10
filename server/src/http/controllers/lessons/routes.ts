import type { FastifyInstance } from 'fastify'
import { verifyJwt } from '@/http/hooks/verify-jwt'
import { schedule } from './schedule'
import { student } from './student'
import { teacher } from './teacher'
import { teacherHistory } from './teacher-history'
import { teacherMetrics } from './teacher-metrics'

export async function lessonsRoutes(app: FastifyInstance) {
  app.get('/lessons/students', { onRequest: [verifyJwt] }, student)
  app.get(
    '/lessons/teachers/:teacherId/history',
    { onRequest: [verifyJwt] },
    teacherHistory,
  )
  app.get(
    '/lessons/teachers/:teacherId/metrics',
    { onRequest: [verifyJwt] },
    teacherMetrics,
  )

  app.post('/lessons', { onRequest: [verifyJwt] }, schedule)
  app.get('/lessons/teachers/:teacherId', { onRequest: [verifyJwt] }, teacher)
}
