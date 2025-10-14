import type { Prisma, Subject } from 'generated/prisma'

export interface SubjectsRepository {
  findByName(name: string): Promise<Subject | null>
  create(data: Prisma.SubjectCreateInput): Promise<Subject>
}
