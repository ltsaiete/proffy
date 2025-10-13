import { hash } from 'bcryptjs'
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'

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
  const usersRepository = new PrismaUsersRepository()

  const userWithSameEmail = await usersRepository.findByEmail(email)

  if (userWithSameEmail) throw new Error('User already exists')

  const passwordHash = await hash(password, 6)

  const user = await usersRepository.create({
    name,
    email,
    passwordHash,
    latitude,
    longitude,
  })

  return { user }
}
