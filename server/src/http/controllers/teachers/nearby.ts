import type { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'
import { makeFetchNearbyTeachersUseCase } from '@/use-cases/teachers/factories/make-fetch-nearby-teachers-use-case'

export async function nearby(request: FastifyRequest, reply: FastifyReply) {
  const requestQuerySchema = z.object({
    latitude: z.coerce.number().refine((value) => Math.abs(value) <= 90),
    longitude: z.coerce.number().refine((value) => Math.abs(value) <= 90),
  })

  const { latitude, longitude } = requestQuerySchema.parse(request.query)
  const fetchNearbyTeachersUseCase = makeFetchNearbyTeachersUseCase()

  const { teachers } = await fetchNearbyTeachersUseCase.execute({
    userLatitude: latitude,
    userLongitude: longitude,
  })
  return reply.status(200).send({ teachers })
}
