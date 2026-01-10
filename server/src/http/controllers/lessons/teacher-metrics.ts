import type { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'
import { makeGetTeacherLessonsMetricsUseCase } from '@/use-cases/factories/make-get-teacher-lessons-metrics-use-case'

export async function teacherMetrics(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const requestParamsSchema = z.object({
    teacherId: z.string(),
  })
  const { teacherId } = requestParamsSchema.parse(request.params)

  const getTeacherLessonsMetricsUseCase = makeGetTeacherLessonsMetricsUseCase()
  const { lessonsCount } = await getTeacherLessonsMetricsUseCase.execute({
    teacherId,
  })

  return reply.status(200).send(lessonsCount)
}
