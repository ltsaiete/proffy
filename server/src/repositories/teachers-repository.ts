import type { Prisma, Subject, Teacher, User } from 'generated/prisma'
export interface TeacherWithUserAndSubject extends Teacher {
  user: Omit<User, 'passwordHash'>
  subject: Subject
}

export interface FindManyNearbyProps {
  latitude: number
  longitude: number
}

export interface TeachersRepository {
  findById(id: string): Promise<Teacher | null>
  findByUserId(userId: string): Promise<Teacher | null>
  findManyBySubject(
    subjectId: string,
    page: number,
  ): Promise<TeacherWithUserAndSubject[]>
  findManyNearby(
    params: FindManyNearbyProps,
  ): Promise<TeacherWithUserAndSubject[]>

  create(data: Prisma.TeacherUncheckedCreateInput): Promise<Teacher>
}
