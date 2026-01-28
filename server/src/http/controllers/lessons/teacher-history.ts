import type { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'
import { makeFetchTeacherLessonsHistoryUseCase } from '@/use-cases/lessons/factories/make-fetch-teacher-lessons-history-use-case'

export async function teacherHistory(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const requestQuerySchema = z.object({
    page: z.coerce.number().min(1).default(1),
  })

  const { page } = requestQuerySchema.parse(request.query)
  const fetchTeacherLessonsHistoryUseCase =
    makeFetchTeacherLessonsHistoryUseCase()

  const { lessons } = await fetchTeacherLessonsHistoryUseCase.execute({
    teacherUserId: request.user.sub,
    page,
  })

  return reply.status(200).send({ lessons })
}
