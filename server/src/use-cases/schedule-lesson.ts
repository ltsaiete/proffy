import dayjs from 'dayjs'
import type { Lesson } from 'generated/prisma'
import type { LessonsRepository } from '@/repositories/lessons-repository'
import type { TeacherSchedulesRepository } from '@/repositories/teacher-schedules-repository'
import type { TeachersRepository } from '@/repositories/teachers-repository'
import { InvalidLessonLengthError } from './errors/invalid-lesson-length-error'
import { InvalidScheduleDateError } from './errors/invalid-schedule-date-error'
import { LessonAlreadyScheduledForSelectedTimeError } from './errors/lesson-already-scheduled-for-selected-time-error'
import { NoScheduleInDateError } from './errors/no-schedule-in-date-error'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

interface ScheduleLessonUseCaseProps {
  studentId: string
  teacherId: string
  startTime: Date
  endTime: Date
}

interface ScheduleLessonUseCaseResponse {
  lesson: Lesson
}

export class ScheduleLessonUseCase {
  constructor(
    private lessonsRepository: LessonsRepository,
    private teachersRepository: TeachersRepository,
    private teacherSchedulesRepository: TeacherSchedulesRepository,
  ) {}

  async execute({
    studentId,
    teacherId,
    startTime,
    endTime,
  }: ScheduleLessonUseCaseProps): Promise<ScheduleLessonUseCaseResponse> {
    const teacher = await this.teachersRepository.findById(teacherId)
    if (!teacher) throw new ResourceNotFoundError('Teacher')

    if (dayjs(startTime).isBefore(dayjs())) throw new InvalidScheduleDateError()

    const weekDay = dayjs(startTime).day()
    if (weekDay !== dayjs(endTime).day()) throw new InvalidScheduleDateError()

    const startTimeInMinutesSinceStartOfDay =
      dayjs(startTime).hour() * 60 + dayjs(startTime).minute()
    const endTimeInMinutesInMinutesSinceStartOfDay =
      dayjs(endTime).hour() * 60 + dayjs(endTime).minute()

    const teacherSchedule =
      await this.teacherSchedulesRepository.findByTeacherIdOnWeekDayAndTimeRange(
        {
          teacherId,
          weekDay,
          startTime: startTimeInMinutesSinceStartOfDay,
          endTime: endTimeInMinutesInMinutesSinceStartOfDay,
        },
      )
    if (!teacherSchedule) throw new NoScheduleInDateError()

    const lessonLength =
      endTimeInMinutesInMinutesSinceStartOfDay -
      startTimeInMinutesSinceStartOfDay
    if (lessonLength < 30) throw new InvalidLessonLengthError()

    const teacherLessonOnSelectedTime =
      await this.lessonsRepository.findByTeacherIdOnTime({
        teacherId,
        from: startTime,
        to: endTime,
      })
    if (teacherLessonOnSelectedTime)
      throw new LessonAlreadyScheduledForSelectedTimeError()

    const studentLessonOnSelectedTime =
      await this.lessonsRepository.findByStudentIdOnTime({
        studentId,
        from: dayjs(startTime).subtract(30, 'minute').toDate(),
        to: endTime,
      })
    if (studentLessonOnSelectedTime)
      throw new LessonAlreadyScheduledForSelectedTimeError()

    const lesson = await this.lessonsRepository.create({
      studentId,
      teacherId,
      startTime,
      endTime,
    })

    return { lesson }
  }
}
