import type { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'
import { makeFetchTeachersBySubjectUseCase } from '@/use-cases/teachers/factories/make-fetch-teachers-by-subject-use-case'

export async function subject(request: FastifyRequest, reply: FastifyReply) {
  const requestParamsSchema = z.object({
    subjectId: z.string(),
  })
  const { subjectId } = requestParamsSchema.parse(request.params)
  const requestQuerySchema = z.object({
    page: z.coerce.number().min(1).default(1),
  })
  const { page } = requestQuerySchema.parse(request.query)

  const fetchTeachersBySubjectUseCase = makeFetchTeachersBySubjectUseCase()

  const { teachers } = await fetchTeachersBySubjectUseCase.execute({
    subjectId,
    page,
  })

  return reply.status(200).send({ teachers })
}
