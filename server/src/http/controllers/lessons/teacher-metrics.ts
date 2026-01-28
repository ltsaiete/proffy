import type { FastifyReply, FastifyRequest } from 'fastify'
import { makeGetTeacherLessonsMetricsUseCase } from '@/use-cases/lessons/factories/make-get-teacher-lessons-metrics-use-case'

export async function teacherMetrics(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const getTeacherLessonsMetricsUseCase = makeGetTeacherLessonsMetricsUseCase()
  const { lessonsCount } = await getTeacherLessonsMetricsUseCase.execute({
    teacherUserId: request.user.sub,
  })

  return reply.status(200).send({ lessonsCount })
}
