import type { TeacherSchedulesRepository } from '@/repositories/teacher-schedules-repository'
import type { TeachersRepository } from '@/repositories/teachers-repository'
import { OnlyOneClassPerDayAllowedError } from './errors/only-one-class-per-day-allowed-error'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { ScheduleTimeOutOfRangeError } from './errors/schedule-time-out-of-range-error'

interface UpdateTeacherScheduleUseCaseProps {
  teacherUserId: string
  schedule: {
    weekDay: number
    startTime: number
    endTime: number
  }[]
}

export class UpdateTeacherScheduleUseCase {
  constructor(
    private teacherSchedulesRepository: TeacherSchedulesRepository,
    private teachersRepository: TeachersRepository,
  ) {}

  async execute({
    teacherUserId,
    schedule,
  }: UpdateTeacherScheduleUseCaseProps) {
    const teacher = await this.teachersRepository.findByUserId(teacherUserId)

    if (!teacher) throw new ResourceNotFoundError('Teacher')

    const scheduleWeekDays: number[] = []

    const serializedSchedule = schedule.map((scheduleDay) => {
      // Schedule time between 7AM and 6PM
      if (scheduleDay.startTime < 7 * 60 || scheduleDay.endTime > 18 * 60)
        throw new ScheduleTimeOutOfRangeError()

      scheduleWeekDays.push(scheduleDay.weekDay)
      return { ...scheduleDay, teacherId: teacher.id }
    })

    const uniqueScheduleWeekDays = new Set(scheduleWeekDays)
    if (uniqueScheduleWeekDays.size !== scheduleWeekDays.length)
      throw new OnlyOneClassPerDayAllowedError()

    const updatedSchedule = await this.teacherSchedulesRepository.saveMany(
      teacher.id,
      serializedSchedule,
    )

    return { schedule: updatedSchedule }
  }
}
