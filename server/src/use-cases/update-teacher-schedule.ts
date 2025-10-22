import type { TeacherSchedulesRepository } from '@/repositories/teacher-schedules-repository'
import type { TeachersRepository } from '@/repositories/teachers-repository'
import { OnlyOneClassPerDayAllowedError } from './errors/only-one-class-per-day-allowed-error'
import { ScheduleTimeOutOfRangeError } from './errors/schedule-time-out-of-range-error'

interface UpdateTeacherScheduleUseCaseProps {
  teacherId: string
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

  async execute({ teacherId, schedule }: UpdateTeacherScheduleUseCaseProps) {
    const teacher = await this.teachersRepository.findById(teacherId)

    if (!teacher) throw new Error('Teacher does not exist')

    const scheduleWeekDays: number[] = []

    schedule.forEach((scheduleDay) => {
      // Schedule time between 7AM and 6PM
      if (scheduleDay.startTime < 7 * 60 || scheduleDay.endTime > 18 * 60)
        throw new ScheduleTimeOutOfRangeError()

      scheduleWeekDays.push(scheduleDay.weekDay)
    })

    const uniqueScheduleWeekDays = new Set(scheduleWeekDays)
    if (uniqueScheduleWeekDays.size !== scheduleWeekDays.length)
      throw new OnlyOneClassPerDayAllowedError()

    const updatedSchedule = await this.teacherSchedulesRepository.updateMany(
      teacherId,
      schedule.map((item) => ({ ...item, teacherId })),
    )

    return { schedule: updatedSchedule }
  }
}
