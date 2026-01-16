import type { Subject, Teacher, User } from 'generated/prisma'
import type { TeachersRepository } from '@/repositories/teachers-repository'

interface FetchNearbyTeachersUseCaseProps {
  userLatitude: number
  userLongitude: number
}

interface TeacherCompoundProps extends Teacher {
  user: Omit<User, 'passwordHash'>
  subject: Subject
}

interface FetchNearbyTeachersUseCaseResponse {
  teachers: TeacherCompoundProps[]
}

export class FetchNearbyTeachersUseCase {
  constructor(private repository: TeachersRepository) {}

  async execute({
    userLatitude,
    userLongitude,
  }: FetchNearbyTeachersUseCaseProps): Promise<FetchNearbyTeachersUseCaseResponse> {
    const teachers = await this.repository.findManyNearby({
      latitude: userLatitude,
      longitude: userLongitude,
    })
    return { teachers }
  }
}
