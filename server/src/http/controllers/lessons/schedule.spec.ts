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

describe('Schedule lesson (E2E)', () => {
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

  it('Should schedule a lesson', async () => {
    vi.setSystemTime(new Date(2025, 0, 19, 0, 0, 0)) // Sunday, January 19

    const { token } = await createAndAuthenticateUser(app)

    const teacherUser = await prisma.user.create({
      data: {
        name: 'Teacher',
        email: 'teacher@example.com',
        passwordHash: '123456',
      },
    })

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

    await prisma.teacherSchedule.create({
      data: {
        teacherId: teacher.id,
        weekDay: 0,
        startTime: 420,
        endTime: 1080,
      },
    })

    const response = await request(app.server)
      .post('/lessons')
      .set('Authorization', `Bearer ${token}`)
      .send({
        teacherId: teacher.id,
        startTime: '2025-01-19T07:00:00Z',
        endTime: '2025-01-19T09:00:00Z',
      })

    expect(response.status).toEqual(201)
  })
})
