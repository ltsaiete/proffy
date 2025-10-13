import { hash } from 'bcryptjs'
import { prisma } from '@/lib/prisma'

interface RegisterUseCaseParams {
  name: string
  email: string
  password: string
  latitude: number
  longitude: number
}

export async function registerUseCase({
  name,
  email,
  password,
  latitude,
  longitude,
}: RegisterUseCaseParams) {
  const userWithSameEmail = await prisma.user.findUnique({
    where: {
      email,
    },
  })

  if (userWithSameEmail) throw new Error('User already exists')

  const passwordHash = await hash(password, 6)

  const user = await prisma.user.create({
    data: {
      name,
      email,
      passwordHash,
      latitude,
      longitude,
    },
  })

  return { user }
}
