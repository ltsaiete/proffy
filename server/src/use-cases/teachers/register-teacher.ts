import type { Teacher } from 'generated/prisma'
import type { TeachersRepository } from '@/repositories/teachers-repository'
import { TeacherAlreadyHasSubjectAssignedError } from '../errors/teacher-already-has-subject-assigned-error'

interface RegisterTeacherProps {
  userId: string
  subjectId: string
  price: number
  description: string | null
  latitude: number
  longitude: number
}

interface RegisterTeacherResponse {
  teacher: Teacher
}

export class RegisterTeacherUseCase {
  constructor(private teachersRepository: TeachersRepository) {}

  async execute({
    userId,
    subjectId,
    price,
    description,
    latitude,
    longitude,
  }: RegisterTeacherProps): Promise<RegisterTeacherResponse> {
    const teacherWithSubjectAssigned =
      await this.teachersRepository.findByUserId(userId)

    if (teacherWithSubjectAssigned)
      throw new TeacherAlreadyHasSubjectAssignedError()

    const teacher = await this.teachersRepository.create({
      userId,
      subjectId,
      price,
      description,
      latitude,
      longitude,
    })

    return { teacher }
  }
}
