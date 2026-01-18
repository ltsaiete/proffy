import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { app } from '@/app'
import { prisma } from '@/lib/prisma'

describe('Get teacher schedule (E2E)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to get the schedule of a teacher', async () => {
    const user = await prisma.user.create({
      data: {
        name: 'John Doe',
        email: 'johndoe@gmail.com',
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
        userId: user.id,
        price: 10,
        subjectId: subject.id,
        latitude: 0,
        longitude: 0,
      },
    })

    await prisma.teacherSchedule.createMany({
      data: [
        {
          weekDay: 0,
          teacherId: teacher.id,
          startTime: 420,
          endTime: 1080,
        },
        {
          weekDay: 1,
          teacherId: teacher.id,
          startTime: 420,
          endTime: 1080,
        },
      ],
    })

    const response = await request(app.server)
      .get(`/teachers/schedule/${teacher.id}`)
      .send()

    expect(response.body).toEqual({
      schedule: [
        expect.objectContaining({
          teacherId: teacher.id,
          id: expect.any(String),
        }),
        expect.objectContaining({
          teacherId: teacher.id,
          id: expect.any(String),
        }),
      ],
    })
  })
})
