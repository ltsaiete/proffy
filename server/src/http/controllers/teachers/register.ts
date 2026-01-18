import type { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'
import { TeacherAlreadyHasSubjectAssignedError } from '@/use-cases/errors/teacher-already-has-subject-assigned-error'
import { makeRegisterTeacherUseCase } from '@/use-cases/teachers/factories/make-register-teacher-use-case'

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const requestBodySchema = z.object({
    subjectId: z.string(),
    price: z.number(),
    description: z.string().nullable(),
    latitude: z.number().refine((value) => Math.abs(value) <= 90),
    longitude: z.number().refine((value) => Math.abs(value) <= 180),
  })

  const { description, longitude, latitude, subjectId, price } =
    requestBodySchema.parse(request.body)

  const registerTeacherUseCase = makeRegisterTeacherUseCase()

  try {
    const { teacher } = await registerTeacherUseCase.execute({
      description,
      latitude,
      longitude,
      subjectId,
      price,
      userId: request.user.sub,
    })

    return reply.status(201).send({ teacher })
  } catch (error) {
    if (error instanceof TeacherAlreadyHasSubjectAssignedError)
      return reply.status(409).send({ message: error.message })

    throw error
  }
}
