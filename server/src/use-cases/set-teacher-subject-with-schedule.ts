import type { TeachersRepository } from '@/repositories/teachers-repository'
import { OnlyOneClassPerDayAllowedError } from './errors/only-one-class-per-day-allowed-error'
import { ScheduleTimeOutOfRangeError } from './errors/schedule-time-out-of-range-error'
import { TeacherAlreadyHasSubjectAssignedError } from './errors/teacher-already-has-subject-assigned-error'

interface SetTeacherSubjectWithScheduleUseCaseProps {
  userId: string
  subjectId: string
  price: number
  description: string | null
  latitude: number
  longitude: number
  schedule: {
    weekDay: number
    startTime: number
    endTime: number
  }[]
}

export class SetTeacherSubjectWithScheduleUseCase {
  constructor(private teachersRepository: TeachersRepository) {}

  async execute({
    price,
    userId,
    subjectId,
    schedule,
    latitude,
    longitude,
    description,
  }: SetTeacherSubjectWithScheduleUseCaseProps) {
    const teacherWithSubjectAssigned =
      await this.teachersRepository.findByUserId(userId)

    if (teacherWithSubjectAssigned)
      throw new TeacherAlreadyHasSubjectAssignedError()

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

    const teacher = await this.teachersRepository.createWithSchedule({
      teacher: {
        userId,
        price,
        subjectId,
        description: description,
        latitude,
        longitude,
      },
      schedule,
    })

    return { teacher }
  }
}
