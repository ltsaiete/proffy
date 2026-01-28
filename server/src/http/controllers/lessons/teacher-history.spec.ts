import request from 'supertest'
import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest'
import { app } from '@/app'
import { prisma } from '@/lib/prisma'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'

describe('Fetch teacher lessons history', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('Should fetch the teacher lessons history', async () => {
    vi.setSystemTime(new Date(2025, 0, 19, 0, 0, 0)) // Sunday, January 19

    const { token } = await createAndAuthenticateUser(app)

    const teacherUser = await prisma.user.findFirstOrThrow()

    const subject = await prisma.subject.create({
      data: {
        name: 'Maths',
      },
    })

    const teacher = await prisma.teacher.create({
      data: {
        price: 10,
        latitude: 0,
        longitude: 0,
        userId: teacherUser.id,
        subjectId: subject.id,
      },
    })

    await prisma.teacherSchedule.createMany({
      data: [
        {
          teacherId: teacher.id,
          weekDay: 0,
          startTime: 420,
          endTime: 1080,
        },
        {
          teacherId: teacher.id,
          weekDay: 1,
          startTime: 420,
          endTime: 1080,
        },
      ],
    })
    const student = await prisma.user.create({
      data: {
        name: 'Student',
        email: 'student@example.com',
        passwordHash: '123456',
      },
    })

    await prisma.lesson.createMany({
      data: [
        {
          teacherId: teacher.id,
          studentId: student.id,
          startTime: new Date(2025, 0, 12, 7, 0, 0),
          endTime: new Date(2025, 0, 12, 9, 0, 0),
        },
        {
          teacherId: teacher.id,
          studentId: student.id,
          startTime: new Date(2025, 0, 13, 7, 0, 0),
          endTime: new Date(2025, 0, 13, 9, 0, 0),
        },
      ],
    })

    const response = await request(app.server)
      .get(`/lessons/teachers/history`)
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.status).toEqual(200)
    expect(response.body.lessons).toHaveLength(2)
  })
})
