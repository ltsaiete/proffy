import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { app } from '@/app'
import { prisma } from '@/lib/prisma'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'

describe('Update teacher schedule', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('Should update the schedule of a teacher', async () => {
    const { token } = await createAndAuthenticateUser(app)
    const user = await prisma.user.findFirstOrThrow()

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
        userId: user.id,
        subjectId: subject.id,
      },
    })

    await prisma.teacherSchedule.create({
      data: {
        weekDay: 0,
        startTime: 420,
        endTime: 1080,
        teacherId: teacher.id,
      },
    })

    const response = await request(app.server)
      .put('/teachers/schedule')
      .set('Authorization', `Bearer ${token}`)
      .send({
        schedule: [
          {
            weekDay: 0,
            startTime: 420,
            endTime: 720,
          },
          {
            weekDay: 1,
            startTime: 420,
            endTime: 1080,
          },
        ],
      })

    expect(response.status).toEqual(200)
    expect(response.body.schedule).toHaveLength(2)
  })
})
