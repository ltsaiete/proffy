import type { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'
import { OnlyOneClassPerDayAllowedError } from '@/use-cases/errors/only-one-class-per-day-allowed-error'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error'
import { ScheduleTimeOutOfRangeError } from '@/use-cases/errors/schedule-time-out-of-range-error'
import { makeUpdateTeacherScheduleUseCase } from '@/use-cases/teachers/factories/make-update-teacher-schedule-use-case'

export async function updateSchedule(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const requestBodySchema = z.object({
    schedule: z.array(
      z.object({
        weekDay: z.number(),
        startTime: z.number(),
        endTime: z.number(),
      }),
    ),
  })

  const { schedule } = requestBodySchema.parse(request.body)

  const updateTeacherScheduleUseCase = makeUpdateTeacherScheduleUseCase()

  try {
    const response = await updateTeacherScheduleUseCase.execute({
      teacherUserId: request.user.sub,
      schedule,
    })

    return reply.status(200).send({ schedule: response.schedule })
  } catch (error) {
    if (error instanceof ResourceNotFoundError)
      return reply.status(404).send({ message: error.message })
    if (
      error instanceof ScheduleTimeOutOfRangeError ||
      error instanceof OnlyOneClassPerDayAllowedError
    )
      return reply.status(400).send({ message: error.message })

    throw error
  }
}
