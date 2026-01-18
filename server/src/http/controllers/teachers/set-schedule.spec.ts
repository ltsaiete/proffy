import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { app } from '@/app'
import { prisma } from '@/lib/prisma'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'

describe('Set teacher schedule (E2E)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('Should set the schedule of a teacher', async () => {
    const { token } = await createAndAuthenticateUser(app)

    const subject = await prisma.subject.create({
      data: {
        name: 'Maths',
      },
    })

    await request(app.server)
      .post('/teachers')
      .set('Authorization', `Bearer ${token}`)
      .send({
        description: '',
        longitude: 0,
        latitude: 0,
        subjectId: subject.id,
        price: 10,
      })

    const response = await request(app.server)
      .post('/teachers/schedule')
      .set('Authorization', `Bearer ${token}`)
      .send({
        schedule: [
          {
            weekDay: 0,
            startTime: 420,
            endTime: 1080,
          },
        ],
      })

    expect(response.statusCode).toEqual(201)
    expect(response.body.scheduleCount).toEqual(1)
  })
})
