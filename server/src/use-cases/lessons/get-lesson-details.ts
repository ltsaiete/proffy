import type {
  LessonsRepository,
  LessonWithStudentAndTeacher,
} from '@/repositories/lessons-repository'
import { NoAccessToLessonError } from '../errors/no-access-to-lesson-error'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'

interface GetLessonDetailsUseCaseProps {
  userId: string
  lessonId: string
}

interface GetLessonDetailsUseCaseResponse {
  lesson: LessonWithStudentAndTeacher
}

export class GetLessonDetailsUseCase {
  constructor(private repository: LessonsRepository) {}

  async execute({
    userId,
    lessonId,
  }: GetLessonDetailsUseCaseProps): Promise<GetLessonDetailsUseCaseResponse> {
    const lesson = await this.repository.findById(lessonId)
    if (!lesson) throw new ResourceNotFoundError('Lesson')

    if (userId !== lesson.studentId && userId !== lesson.teacher.userId)
      throw new NoAccessToLessonError()

    return { lesson }
  }
}
