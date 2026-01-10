import type { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'
import { makeFetchTeacherLessonsHistoryUseCase } from '@/use-cases/factories/make-fetch-teacher-lessons-history-use-case'

export async function teacherHistory(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const requestQuerySchema = z.object({
    page: z.number(),
  })
  const requestParamsSchema = z.object({
    teacherId: z.string(),
  })

  const { page } = requestQuerySchema.parse(request.query)
  const { teacherId } = requestParamsSchema.parse(request.params)
  const fetchTeacherLessonsHistoryUseCase =
    makeFetchTeacherLessonsHistoryUseCase()

  const { lessons } = await fetchTeacherLessonsHistoryUseCase.execute({
    teacherId,
    page,
  })

  return reply.status(200).send({ lessons })
}
