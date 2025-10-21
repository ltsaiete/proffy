import type { TeacherSubject } from 'generated/prisma'

export interface TeacherSubjectRepository {
  create(): Promise<TeacherSubject>
}
