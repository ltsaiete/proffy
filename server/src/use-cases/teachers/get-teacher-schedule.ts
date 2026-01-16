import type { TeacherSchedule } from 'generated/prisma'
import type { TeacherSchedulesRepository } from '@/repositories/teacher-schedules-repository'

interface GetTeacherScheduleUseCaseProps {
  teacherId: string
}

interface GetTeacherScheduleUseCaseResponse {
  schedule: TeacherSchedule[]
}

export class GetTeacherScheduleUseCase {
  constructor(private repository: TeacherSchedulesRepository) {}

  async execute({
    teacherId,
  }: GetTeacherScheduleUseCaseProps): Promise<GetTeacherScheduleUseCaseResponse> {
    const schedule = await this.repository.findManyByTeacherId(teacherId)
    return { schedule }
  }
}
