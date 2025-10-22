import type { Prisma, Teacher } from 'generated/prisma'

export interface CreateWithScheduleProps {
  teacher: Prisma.TeacherUncheckedCreateInput
  schedule: {
    weekDay: number
    startTime: number
    endTime: number
  }[]
}

export interface TeachersRepository {
  findById(id: string): Promise<Teacher | null>
  findByUserId(userId: string): Promise<Teacher | null>
  createWithSchedule(data: CreateWithScheduleProps): Promise<Teacher>
}
