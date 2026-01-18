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
    const nearUser = await prisma.user.create({
      data: {
        name: 'Near teacher',
        email: 'near@example.com',
        passwordHash: '123456',
      },
    })
    const farUser = await prisma.user.create({
      data: {
        name: 'Far teacher',
        email: 'far@example.com',
        passwordHash: '123456',
      },
    })

    const subject = await prisma.subject.create({
      data: {
        name: 'Maths',
      },
    })

    await prisma.teacher.create({
      data: {
        price: 10,
        latitude: -25.8878476200255,
        longitude: 32.44430071970727,
        userId: nearUser.id,
        subjectId: subject.id,
      },
    })
    await prisma.teacher.create({
      data: {
        price: 10,
        latitude: -25.75813186699103,
        longitude: 32.67643598129227,
        userId: farUser.id,
        subjectId: subject.id,
      },
    })

    const response = await request(app.server)
      .get('/teachers/nearby')
      .query({
        latitude: -25.891959386430337,
        longitude: 32.434172698501754,
      })
      .send()

    expect(response.status).toEqual(200)
    expect(response.body.teachers).toHaveLength(1)
    expect(response.body.teachers).toEqual([
      expect.objectContaining({
        user: expect.objectContaining({ name: 'Near teacher' }),
      }),
    ])
  })
})
