import type { Prisma, Subject, Teacher, User } from 'generated/prisma'

export interface CreateWithScheduleProps {
  teacher: Prisma.TeacherUncheckedCreateInput
  schedule: {
    weekDay: number
    startTime: number
    endTime: number
  }[]
}

interface TeacherCompoundResponse extends Teacher {
  user: User
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
  ): Promise<TeacherCompoundResponse[]>
  findManyNearby(
    params: FindManyNearbyProps,
  ): Promise<TeacherCompoundResponse[]>

  createWithSchedule(data: CreateWithScheduleProps): Promise<Teacher>
}
