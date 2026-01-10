import type { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'
import { InvalidLessonLengthError } from '@/use-cases/errors/invalid-lesson-length-error'
import { InvalidScheduleDateError } from '@/use-cases/errors/invalid-schedule-date-error'
import { LessonAlreadyScheduledForSelectedTimeError } from '@/use-cases/errors/lesson-already-scheduled-for-selected-time-error'
import { NoScheduleInDateError } from '@/use-cases/errors/no-schedule-in-date-error'
import { makeScheduleLessonUseCase } from '@/use-cases/factories/make-schedule-lesson-use-case'

export async function schedule(request: FastifyRequest, reply: FastifyReply) {
  const requestBodySchema = z.object({
    teacherId: z.string(),
    startTime: z.date(),
    endTime: z.date(),
  })
  const { teacherId, startTime, endTime } = requestBodySchema.parse(
    request.body,
  )

  const scheduleLessonUseCase = makeScheduleLessonUseCase()

  try {
    await scheduleLessonUseCase.execute({
      teacherId,
      studentId: request.user.sub,
      startTime,
      endTime,
    })

    return reply.status(201).send()
  } catch (error) {
    if (
      error instanceof InvalidScheduleDateError ||
      error instanceof NoScheduleInDateError ||
      error instanceof InvalidLessonLengthError ||
      error instanceof LessonAlreadyScheduledForSelectedTimeError
    )
      return reply.status(400).send({ message: error.message })

    throw error
  }
}
