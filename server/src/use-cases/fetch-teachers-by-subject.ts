import type { Subject, Teacher, User } from 'generated/prisma'
import type { TeachersRepository } from '@/repositories/teachers-repository'

interface FetchTeachersBySubjectUseCaseProps {
  page: number
  subjectId: string
}

interface TeacherCompoundProps extends Teacher {
  user: User
  subject: Subject
}

interface FetchTeachersBySubjectUseCaseResponse {
  teachers: TeacherCompoundProps[]
}

export class FetchTeachersBySubjectUseCase {
  constructor(private repository: TeachersRepository) {}

  async execute({
    subjectId,
    page,
  }: FetchTeachersBySubjectUseCaseProps): Promise<FetchTeachersBySubjectUseCaseResponse> {
    const teachers = await this.repository.findManyBySubject(subjectId, page)
    return { teachers }
  }
}
