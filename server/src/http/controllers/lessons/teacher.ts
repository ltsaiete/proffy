import type { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'
import { makeFetchTeacherLessonsUseCase } from '@/use-cases/factories/make-fetch-teacher-lessons-use-case'

export async function teacher(request: FastifyRequest, reply: FastifyReply) {
  const requestParamsSchema = z.object({
    teacherId: z.string(),
  })
  const { teacherId } = requestParamsSchema.parse(request.params)

  const fetchTeacherLessonsUseCase = makeFetchTeacherLessonsUseCase()
  const { lessons } = await fetchTeacherLessonsUseCase.execute({ teacherId })

  return reply.status(200).send({ lessons })
}
