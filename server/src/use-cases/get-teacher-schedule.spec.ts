import { hash } from 'bcryptjs'
import { beforeEach, describe, expect, it } from 'vitest'
import { InMemorySubjectsRepository } from '@/repositories/in-memory/in-memory-subjects-repository'
import { InMemoryTeacherSchedulesRepository } from '@/repositories/in-memory/in-memory-teacher-schedules-repository'
import { InMemoryTeachersRepository } from '@/repositories/in-memory/in-memory-teachers-repository'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { GetTeacherScheduleUseCase } from './get-teacher-schedule'

describe('Update teacher schedule use case', () => {
  let teachersRepository: InMemoryTeachersRepository
  let usersRepository: InMemoryUsersRepository
  let subjectsRepository: InMemorySubjectsRepository
  let teacherSchedulesRepository: InMemoryTeacherSchedulesRepository
  let sut: GetTeacherScheduleUseCase

  beforeEach(() => {
    teacherSchedulesRepository = new InMemoryTeacherSchedulesRepository()
    teachersRepository = new InMemoryTeachersRepository({
      inMemoryTeacherSchedulesRepository: teacherSchedulesRepository,
    })
    usersRepository = new InMemoryUsersRepository()
    subjectsRepository = new InMemorySubjectsRepository()
    sut = new GetTeacherScheduleUseCase(teacherSchedulesRepository)
  })

  it('Should get a teacher schedule', async () => {
    await usersRepository.create({
      id: 'user-01',
      name: 'John Doe',
      email: 'johndoe@example.com',
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
        userId: 'user-01',
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

    const { schedule } = await sut.execute({
      teacherId: 'teacher-01',
    })

    expect(schedule).toHaveLength(1)
    expect(schedule).toEqual([
      expect.objectContaining({
        teacherId: 'teacher-01',
        id: expect.any(String),
      }),
    ])
  })
})
// days above 7
