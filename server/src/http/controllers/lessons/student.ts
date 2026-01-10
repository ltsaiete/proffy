import type { FastifyReply, FastifyRequest } from 'fastify'
import { makeFetchStudentLessonsUseCase } from '@/use-cases/factories/make-fetch-student-lessons-use-case'

export async function student(request: FastifyRequest, reply: FastifyReply) {
  const fetchStudentLessonsUseCase = makeFetchStudentLessonsUseCase()

  const { lessons } = await fetchStudentLessonsUseCase.execute({
    studentId: request.user.sub,
  })
  return reply.status(200).send({ lessons })
}
