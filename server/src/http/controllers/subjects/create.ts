import type { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'
import { SubjectAlreadyExistsError } from '@/use-cases/errors/subject-already-exists-error'
import { makeCreateSubjectUseCase } from '@/use-cases/factories/make-create-subject-use-case'

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const requestBodySchema = z.object({
    name: z.string(),
    description: z.string().nullable(),
  })

  const { description, name } = requestBodySchema.parse(request.body)
  const createSubjectUseCase = makeCreateSubjectUseCase()
  try {
    const { subject } = await createSubjectUseCase.execute({
      name,
      description,
    })
    return reply.status(201).send({ subject })
  } catch (error) {
    if (error instanceof SubjectAlreadyExistsError)
      return reply.status(409).send({ message: error.message })

    throw error
  }
}
