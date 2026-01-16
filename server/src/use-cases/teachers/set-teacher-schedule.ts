import type { TeacherSchedulesRepository } from '@/repositories/teacher-schedules-repository'
import type { TeachersRepository } from '@/repositories/teachers-repository'
import { OnlyOneClassPerDayAllowedError } from '../errors/only-one-class-per-day-allowed-error'
import { ScheduleTimeOutOfRangeError } from '../errors/schedule-time-out-of-range-error'
import { TeacherAlreadyHasScheduleError } from '../errors/teacher-already-has-schedule-error'
import { UserNotTeacherError } from '../errors/user-not-teacher-error'

interface SetTeacherScheduleUseCaseProps {
  teacherUserId: string
  schedule: {
    weekDay: number
    startTime: number
    endTime: number
  }[]
}

interface SetTeacherScheduleUseCaseResponse {
  scheduleCount: number
}

export class SetTeacherScheduleUseCase {
  constructor(
    private teacherSchedulesRepository: TeacherSchedulesRepository,
    private teachersRepository: TeachersRepository,
  ) {}
  async execute({
    teacherUserId,
    schedule,
  }: SetTeacherScheduleUseCaseProps): Promise<SetTeacherScheduleUseCaseResponse> {
    const teacher = await this.teachersRepository.findByUserId(teacherUserId)
    if (!teacher) throw new UserNotTeacherError()

    const existingTeacherSchedules =
      await this.teacherSchedulesRepository.findManyByTeacherId(teacher.id)
    if (existingTeacherSchedules.length > 0)
      throw new TeacherAlreadyHasScheduleError()

    const scheduleWeekDays: number[] = []

    const serializedSchedules = schedule.map((scheduleDay) => {
      // Schedule time between 7AM and 6PM
      if (scheduleDay.startTime < 7 * 60 || scheduleDay.endTime > 18 * 60)
        throw new ScheduleTimeOutOfRangeError()

      scheduleWeekDays.push(scheduleDay.weekDay)

      return { ...scheduleDay, teacherId: teacher.id }
    })

    const uniqueScheduleWeekDays = new Set(scheduleWeekDays)
    if (uniqueScheduleWeekDays.size !== scheduleWeekDays.length)
      throw new OnlyOneClassPerDayAllowedError()

    const payload =
      await this.teacherSchedulesRepository.createMany(serializedSchedules)

    return { scheduleCount: payload.count }
  }
}
