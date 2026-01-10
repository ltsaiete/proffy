import type { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'
import { makeGetTeacherScheduleUseCase } from '@/use-cases/factories/make-get-teacher-schedule-use-case'

export async function getSchedule(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const requestParamsSchema = z.object({
    teacherId: z.string(),
  })
  const { teacherId } = requestParamsSchema.parse(request.params)

  const getTeacherScheduleUseCase = makeGetTeacherScheduleUseCase()

  const { schedule } = await getTeacherScheduleUseCase.execute({ teacherId })

  return reply.status(200).send({ schedule })
}
