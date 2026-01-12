import { hash } from 'bcryptjs'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { InMemoryLessonsRepository } from '@/repositories/in-memory/in-memory-lessons-repository'
import { InMemorySubjectsRepository } from '@/repositories/in-memory/in-memory-subjects-repository'
import { InMemoryTeacherSchedulesRepository } from '@/repositories/in-memory/in-memory-teacher-schedules-repository'
import { InMemoryTeachersRepository } from '@/repositories/in-memory/in-memory-teachers-repository'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { NoAccessToLessonError } from './errors/no-access-to-lesson-erro'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { GetLessonDetailsUseCase } from './get-lesson-details'

describe('Get lesson details use case', () => {
  let teachersRepository: InMemoryTeachersRepository
  let usersRepository: InMemoryUsersRepository
  let subjectsRepository: InMemorySubjectsRepository
  let teacherSchedulesRepository: InMemoryTeacherSchedulesRepository
  let lessonsRepository: InMemoryLessonsRepository
  let sut: GetLessonDetailsUseCase

  beforeEach(async () => {
    teacherSchedulesRepository = new InMemoryTeacherSchedulesRepository()
    teachersRepository = new InMemoryTeachersRepository({
      inMemoryTeacherSchedulesRepository: teacherSchedulesRepository,
    })
    usersRepository = new InMemoryUsersRepository()
    subjectsRepository = new InMemorySubjectsRepository()
    lessonsRepository = new InMemoryLessonsRepository({
      inMemoryTeachersRepository: teachersRepository,
      inMemoryUsersRepository: usersRepository,
    })

    sut = new GetLessonDetailsUseCase(lessonsRepository)
    vi.useFakeTimers()

    await usersRepository.create({
      id: 'teacher-user-01',
      name: 'Teacher User',
      email: 'teacher@example.com',
      passwordHash: await hash('123456', 6),
    })

    await usersRepository.create({
      id: 'student-user-01',
      name: 'Student User',
      email: 'student@example.com',
      passwordHash: await hash('123456', 6),
    })

    await subjectsRepository.create({
      id: 'subject-01',
      name: 'Maths',
    })

    await teachersRepository.create({
      id: 'teacher-01',
      price: 10,
      userId: 'teacher-user-01',
      subjectId: 'subject-01',
      description: '',
      latitude: 0,
      longitude: 0,
    })

    await teacherSchedulesRepository.createMany([
      {
        id: 'schedule-01',
        teacherId: 'teacher-01',
        weekDay: 0,
        startTime: 420,
        endTime: 1080,
      },
      {
        id: 'schedule-02',
        teacherId: 'teacher-01',
        weekDay: 1,
        startTime: 420,
        endTime: 1080,
      },
    ])

    vi.setSystemTime(new Date(2025, 0, 19, 0, 0, 0)) // Sunday, January 19

    await lessonsRepository.create({
      id: 'lesson-01',
      teacherId: 'teacher-01',
      studentId: 'student-user-01',
      startTime: new Date(2025, 0, 19, 7, 0, 0),
      endTime: new Date(2025, 0, 19, 9, 0, 0),
    })
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('Should allow the teacher to get the details of a lesson', async () => {
    const { lesson } = await sut.execute({
      userId: 'teacher-user-01',
      lessonId: 'lesson-01',
    })

    expect(lesson).toEqual(
      expect.objectContaining({
        teacherId: 'teacher-01',
        studentId: 'student-user-01',
        teacher: expect.objectContaining({
          userId: 'teacher-user-01',
        }),
        id: 'lesson-01',
      }),
    )
  })

  it('Should allow the student to get the details of a lesson', async () => {
    const { lesson } = await sut.execute({
      userId: 'student-user-01',
      lessonId: 'lesson-01',
    })

    expect(lesson).toEqual(
      expect.objectContaining({
        teacherId: 'teacher-01',
        studentId: 'student-user-01',
        teacher: expect.objectContaining({
          userId: 'teacher-user-01',
        }),
        id: 'lesson-01',
      }),
    )
  })

  it('Should not be able to get the details of a non existing lesson', async () => {
    await expect(() =>
      sut.execute({
        userId: 'student-user-01',
        lessonId: 'non-existing-lesson',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })

  it('Should not allow a user to get the details a lesson that he does not participate', async () => {
    await expect(() =>
      sut.execute({
        userId: 'user-02',
        lessonId: 'lesson-01',
      }),
    ).rejects.toBeInstanceOf(NoAccessToLessonError)
  })
})
// days above 7
