import type { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'
import { NoAccessToLessonError } from '@/use-cases/errors/no-access-to-lesson-error'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error'
import { makeGetLessonDetailsUseCase } from '@/use-cases/lessons/factories/make-get-lesson-details-use-case'

export async function details(request: FastifyRequest, reply: FastifyReply) {
  const requestParamsSchema = z.object({
    id: z.string(),
  })
  const { id } = requestParamsSchema.parse(request.params)
  const getLessonDetails = makeGetLessonDetailsUseCase()

  try {
    const { lesson } = await getLessonDetails.execute({
      lessonId: id,
      userId: request.user.sub,
    })
    return reply.status(200).send({ lesson })
  } catch (error) {
    if (error instanceof ResourceNotFoundError)
      return reply.status(404).send({ message: error.message })
    if (error instanceof NoAccessToLessonError)
      return reply.status(401).send({ message: error.message })

    throw error
  }
}
