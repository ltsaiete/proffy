import { hash } from 'bcryptjs'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { InMemoryLessonsRepository } from '@/repositories/in-memory/in-memory-lessons-repository'
import { InMemorySubjectsRepository } from '@/repositories/in-memory/in-memory-subjects-repository'
import { InMemoryTeacherSchedulesRepository } from '@/repositories/in-memory/in-memory-teacher-schedules-repository'
import { InMemoryTeachersRepository } from '@/repositories/in-memory/in-memory-teachers-repository'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { InvalidLessonLengthError } from './errors/invalid-lesson-length-error'
import { InvalidScheduleDateError } from './errors/invalid-schedule-date-error'
import { LessonAlreadyScheduledForSelectedTimeError } from './errors/lesson-already-scheduled-for-selected-time-error'
import { NoScheduleInDateError } from './errors/no-schedule-in-date-error'
import { ScheduleLessonUseCase } from './schedule-lesson'

describe('Schedule lesson use case', () => {
  let teachersRepository: InMemoryTeachersRepository
  let usersRepository: InMemoryUsersRepository
  let subjectsRepository: InMemorySubjectsRepository
  let teacherSchedulesRepository: InMemoryTeacherSchedulesRepository
  let lessonsRepository: InMemoryLessonsRepository
  let sut: ScheduleLessonUseCase

  beforeEach(async () => {
    teacherSchedulesRepository = new InMemoryTeacherSchedulesRepository()
    teachersRepository = new InMemoryTeachersRepository({
      inMemoryTeacherSchedulesRepository: teacherSchedulesRepository,
    })
    usersRepository = new InMemoryUsersRepository()
    subjectsRepository = new InMemorySubjectsRepository()
    lessonsRepository = new InMemoryLessonsRepository()
    sut = new ScheduleLessonUseCase(
      lessonsRepository,
      teachersRepository,
      teacherSchedulesRepository,
    )

    await usersRepository.create({
      id: 'teacher-user-01',
      name: 'Teacher',
      email: 'teacher@example.com',
      passwordHash: await hash('123456', 6),
    })

    await usersRepository.create({
      id: 'student-01',
      name: 'Student',
      email: 'student@example.com',
      passwordHash: await hash('123456', 6),
    })

    await usersRepository.create({
      id: 'student-02',
      name: 'Student 02',
      email: 'student02@example.com',
      passwordHash: await hash('123456', 6),
    })

    await subjectsRepository.create({
      id: 'subject-01',
      name: 'Maths',
    })

    await teachersRepository.createWithSchedule({
      teacher: {
        id: 'teacher-01',
        price: 10,
        userId: 'teacher-user-01',
        subjectId: 'subject-01',
        description: '',
        latitude: 0,
        longitude: 0,
      },
      schedule: [
        {
          weekDay: 0,
          startTime: 420,
          endTime: 1080,
        },
        {
          weekDay: 1,
          startTime: 420,
          endTime: 720,
        },
      ],
    })

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('Should schedule a lesson with a teacher', async () => {
    vi.setSystemTime(new Date(2025, 0, 19, 0, 0, 0)) // Sunday, January 19

    const { lesson } = await sut.execute({
      teacherId: 'teacher-01',
      studentId: 'student-01',
      startTime: new Date(2025, 0, 19, 7, 0, 0),
      endTime: new Date(2025, 0, 19, 9, 0, 0),
    })

    expect(lesson.id).toEqual(expect.any(String))
  })

  it('should not be able to schedule a lesson for a past date', async () => {
    vi.setSystemTime(new Date(2025, 0, 19, 0, 0, 0)) // Sunday, January 19

    await expect(() =>
      sut.execute({
        teacherId: 'teacher-01',
        studentId: 'student-01',

        startTime: new Date(2025, 0, 12, 7, 0, 0),
        endTime: new Date(2025, 0, 12, 9, 0, 0),
      }),
    ).rejects.toBeInstanceOf(InvalidScheduleDateError)
  })

  it('should not be able to schedule a lesson for a date or time that the teacher is not available', async () => {
    vi.setSystemTime(new Date(2025, 0, 19, 0, 0, 0)) // Sunday, January 19

    await expect(() =>
      sut.execute({
        teacherId: 'teacher-01',
        studentId: 'student-01',

        startTime: new Date(2025, 0, 21, 7, 0, 0),
        endTime: new Date(2025, 0, 21, 9, 0, 0),
      }),
    ).rejects.toBeInstanceOf(NoScheduleInDateError)

    await expect(() =>
      sut.execute({
        teacherId: 'teacher-01',
        studentId: 'student-01',

        startTime: new Date(2025, 0, 19, 6, 0, 0),
        endTime: new Date(2025, 0, 19, 9, 0, 0),
      }),
    ).rejects.toBeInstanceOf(NoScheduleInDateError)

    await expect(() =>
      sut.execute({
        teacherId: 'teacher-01',
        studentId: 'student-01',

        startTime: new Date(2025, 0, 19, 17, 0, 0),
        endTime: new Date(2025, 0, 19, 19, 0, 0),
      }),
    ).rejects.toBeInstanceOf(NoScheduleInDateError)
  })

  it('should not be able to schedule a lesson with time range in different days', async () => {
    vi.setSystemTime(new Date(2025, 0, 19, 0, 0, 0)) // Sunday, January 19

    await expect(() =>
      sut.execute({
        teacherId: 'teacher-01',
        studentId: 'student-01',

        startTime: new Date(2025, 0, 19, 17, 0, 0),
        endTime: new Date(2025, 0, 20, 9, 0, 0),
      }),
    ).rejects.toBeInstanceOf(InvalidScheduleDateError)
  })

  it('should not be able to schedule a lesson with less than 30 min', async () => {
    vi.setSystemTime(new Date(2025, 0, 19, 0, 0, 0)) // Sunday, January 19

    await expect(() =>
      sut.execute({
        teacherId: 'teacher-01',
        studentId: 'student-01',

        startTime: new Date(2025, 0, 19, 7, 0, 0),
        endTime: new Date(2025, 0, 19, 7, 29, 0),
      }),
    ).rejects.toBeInstanceOf(InvalidLessonLengthError)
  })

  it('should not be able to schedule a lesson when the teacher already has a lesson scheduled for that time', async () => {
    vi.setSystemTime(new Date(2025, 0, 19, 0, 0, 0)) // Sunday, January 19

    await sut.execute({
      teacherId: 'teacher-01',
      studentId: 'student-01',
      startTime: new Date(2025, 0, 19, 9, 0, 0),
      endTime: new Date(2025, 0, 19, 12, 0, 0),
    })

    await expect(() =>
      sut.execute({
        teacherId: 'teacher-01',
        studentId: 'student-02',
        startTime: new Date(2025, 0, 19, 8, 0, 0),
        endTime: new Date(2025, 0, 19, 9, 30, 0),
      }),
    ).rejects.toBeInstanceOf(LessonAlreadyScheduledForSelectedTimeError)

    await expect(() =>
      sut.execute({
        teacherId: 'teacher-01',
        studentId: 'student-02',
        startTime: new Date(2025, 0, 19, 11, 0, 0),
        endTime: new Date(2025, 0, 19, 12, 30, 0),
      }),
    ).rejects.toBeInstanceOf(LessonAlreadyScheduledForSelectedTimeError)

    await expect(() =>
      sut.execute({
        teacherId: 'teacher-01',
        studentId: 'student-02',
        startTime: new Date(2025, 0, 19, 10, 0, 0),
        endTime: new Date(2025, 0, 19, 11, 0, 0),
      }),
    ).rejects.toBeInstanceOf(LessonAlreadyScheduledForSelectedTimeError)

    await expect(() =>
      sut.execute({
        teacherId: 'teacher-01',
        studentId: 'student-02',
        startTime: new Date(2025, 0, 19, 8, 0, 0),
        endTime: new Date(2025, 0, 19, 13, 0, 0),
      }),
    ).rejects.toBeInstanceOf(LessonAlreadyScheduledForSelectedTimeError)
  })

  it('Should be able to schedule two lessons for the teacher in the same day with different time', async () => {
    vi.setSystemTime(new Date(2025, 0, 19, 0, 0, 0)) // Sunday, January 19

    await expect(
      sut.execute({
        teacherId: 'teacher-01',
        studentId: 'student-01',
        startTime: new Date(2025, 0, 19, 12, 30, 0),
        endTime: new Date(2025, 0, 19, 13, 0, 0),
      }),
    ).resolves.toEqual({
      lesson: expect.objectContaining({ id: expect.any(String) }),
    })

    await expect(
      sut.execute({
        teacherId: 'teacher-01',
        studentId: 'student-02',
        startTime: new Date(2025, 0, 19, 13, 0, 0),
        endTime: new Date(2025, 0, 19, 14, 0, 0),
      }),
    ).resolves.toEqual({
      lesson: expect.objectContaining({ id: expect.any(String) }),
    })
  })

  it('should not be able to schedule a lesson when the student already has a lesson scheduled for less than 30min before that time', async () => {
    vi.setSystemTime(new Date(2025, 0, 19, 0, 0, 0)) // Sunday, January 19

    await usersRepository.create({
      id: 'teacher-user-02',
      name: 'Teacher',
      email: 'teacher02@example.com',
      passwordHash: await hash('123456', 6),
    })

    await teachersRepository.createWithSchedule({
      teacher: {
        id: 'teacher-02',
        price: 10,
        userId: 'teacher-user-02',
        subjectId: 'subject-01',
        description: '',
        latitude: 0,
        longitude: 0,
      },
      schedule: [
        {
          weekDay: 0,
          startTime: 420,
          endTime: 1080,
        },
      ],
    })

    await sut.execute({
      teacherId: 'teacher-01',
      studentId: 'student-01',
      startTime: new Date(2025, 0, 19, 9, 0, 0),
      endTime: new Date(2025, 0, 19, 12, 0, 0),
    })

    await expect(() =>
      sut.execute({
        teacherId: 'teacher-02',
        studentId: 'student-01',
        startTime: new Date(2025, 0, 19, 8, 0, 0),
        endTime: new Date(2025, 0, 19, 9, 30, 0),
      }),
    ).rejects.toBeInstanceOf(LessonAlreadyScheduledForSelectedTimeError)

    await expect(() =>
      sut.execute({
        teacherId: 'teacher-02',
        studentId: 'student-01',
        startTime: new Date(2025, 0, 19, 11, 0, 0),
        endTime: new Date(2025, 0, 19, 12, 30, 0),
      }),
    ).rejects.toBeInstanceOf(LessonAlreadyScheduledForSelectedTimeError)

    await expect(() =>
      sut.execute({
        teacherId: 'teacher-02',
        studentId: 'student-01',
        startTime: new Date(2025, 0, 19, 10, 0, 0),
        endTime: new Date(2025, 0, 19, 11, 0, 0),
      }),
    ).rejects.toBeInstanceOf(LessonAlreadyScheduledForSelectedTimeError)

    await expect(() =>
      sut.execute({
        teacherId: 'teacher-02',
        studentId: 'student-01',
        startTime: new Date(2025, 0, 19, 12, 29, 0),
        endTime: new Date(2025, 0, 19, 14, 0, 0),
      }),
    ).rejects.toBeInstanceOf(LessonAlreadyScheduledForSelectedTimeError)
  })

  it('Should be able to schedule two lessons for the student in the same day with different time', async () => {
    vi.setSystemTime(new Date(2025, 0, 19, 0, 0, 0)) // Sunday, January 19

    await expect(
      sut.execute({
        teacherId: 'teacher-01',
        studentId: 'student-01',
        startTime: new Date(2025, 0, 19, 9, 0, 0),
        endTime: new Date(2025, 0, 19, 12, 30, 0),
      }),
    ).resolves.toEqual({
      lesson: expect.objectContaining({ id: expect.any(String) }),
    })

    await expect(
      sut.execute({
        teacherId: 'teacher-01',
        studentId: 'student-01',
        startTime: new Date(2025, 0, 19, 13, 0, 0),
        endTime: new Date(2025, 0, 19, 14, 0, 0),
      }),
    ).resolves.toEqual({
      lesson: expect.objectContaining({ id: expect.any(String) }),
    })
  })
})
