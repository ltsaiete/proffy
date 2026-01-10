import type { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'
import { OnlyOneClassPerDayAllowedError } from '@/use-cases/errors/only-one-class-per-day-allowed-error'
import { ScheduleTimeOutOfRangeError } from '@/use-cases/errors/schedule-time-out-of-range-error'
import { TeacherAlreadyHasSubjectAssignedError } from '@/use-cases/errors/teacher-already-has-subject-assigned-error'
import { makeSetTeacherSubjectWithScheduleUseCase } from '@/use-cases/factories/make-set-teacher-subject-with-schedule-use-case'

export async function setSubjectWithSchedule(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const requestBodySchema = z.object({
    price: z.number(),
    userId: z.string(),
    subjectId: z.string(),
    schedule: z.array(
      z.object({
        weekDay: z.number(),
        startTime: z.number(),
        endTime: z.number(),
      }),
    ),
    latitude: z.number().refine((value) => Math.abs(value) <= 90),
    longitude: z.number().refine((value) => Math.abs(value) <= 180),
    description: z.string().nullable(),
  })

  const {
    price,
    userId,
    subjectId,
    schedule,
    latitude,
    longitude,
    description,
  } = requestBodySchema.parse(request.body)

  const setTeacherSubjectWithScheduleUseCase =
    makeSetTeacherSubjectWithScheduleUseCase()

  try {
    const { teacher } = await setTeacherSubjectWithScheduleUseCase.execute({
      price,
      userId,
      subjectId,
      schedule,
      latitude,
      longitude,
      description,
    })

    return reply.status(201).send({ teacher })
  } catch (error) {
    if (error instanceof TeacherAlreadyHasSubjectAssignedError)
      return reply.status(409).send(error.message)
    if (error instanceof ScheduleTimeOutOfRangeError)
      return reply.status(400).send(error.message)
    if (error instanceof OnlyOneClassPerDayAllowedError)
      return reply.status(400).send(error.message)

    throw error
  }
}
