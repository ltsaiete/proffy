import type { Subject, Teacher, User } from 'generated/prisma'
import type { SubjectsRepository } from '@/repositories/subjects-repository'
import type { TeachersRepository } from '@/repositories/teachers-repository'
import { SubjectAlreadyExistsError } from './errors/subject-already-exists-error'

interface FetchNearbyTeachersUseCaseProps {
  userLatitude: number
  userLongitude: number
}

interface TeacherCompoundProps extends Teacher {
  user: User
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
