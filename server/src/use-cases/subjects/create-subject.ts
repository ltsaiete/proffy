import type { SubjectsRepository } from '@/repositories/subjects-repository'
import { SubjectAlreadyExistsError } from '../errors/subject-already-exists-error'

interface CreateSubjectUseCaseProps {
  name: string
  description: string | null
}
export class CreateSubjectUseCase {
  constructor(private repository: SubjectsRepository) {}

  async execute({ name, description }: CreateSubjectUseCaseProps) {
    const subjectWithSameName = await this.repository.findByName(name)
    if (subjectWithSameName) throw new SubjectAlreadyExistsError()

    const subject = await this.repository.create({
      name,
      description,
    })

    return { subject }
  }
}
