import type { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'
import { OnlyOneClassPerDayAllowedError } from '@/use-cases/errors/only-one-class-per-day-allowed-error'
import { ScheduleTimeOutOfRangeError } from '@/use-cases/errors/schedule-time-out-of-range-error'
import { TeacherAlreadyHasScheduleError } from '@/use-cases/errors/teacher-already-has-schedule-error'
import { UserNotTeacherError } from '@/use-cases/errors/user-not-teacher-error'
import { makeSetTeacherScheduleUseCase } from '@/use-cases/teachers/factories/make-set-teacher-schedule-use-case'

export async function setSchedule(
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

  const setTeacherScheduleUseCase = makeSetTeacherScheduleUseCase()

  try {
    const { scheduleCount } = await setTeacherScheduleUseCase.execute({
      teacherUserId: request.user.sub,
      schedule,
    })

    return reply.status(201).send({ scheduleCount })
  } catch (error) {
    if (error instanceof UserNotTeacherError)
      return reply.status(400).send(error.message)
    if (error instanceof TeacherAlreadyHasScheduleError)
      return reply.status(400).send(error.message)
    if (error instanceof ScheduleTimeOutOfRangeError)
      return reply.status(400).send(error.message)
    if (error instanceof OnlyOneClassPerDayAllowedError)
      return reply.status(400).send(error.message)

    throw error
  }
}
