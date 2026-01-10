import type { FastifyInstance } from 'fastify'
import { verifyJwt } from '@/http/hooks/verify-jwt'
import { create } from './create'

export async function subjectsRoutes(app: FastifyInstance) {
  app.post('/subjects', { onRequest: [verifyJwt] }, create)
}
