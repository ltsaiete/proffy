import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { app } from '@/app'
import { prisma } from '@/lib/prisma'

describe('Fetch teachers by subject (E2E)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('Should get teachers by subject', async () => {
    const mathsUser = await prisma.user.create({
      data: {
        name: 'Maths teacher',
        email: 'maths@example.com',
        passwordHash: '123456',
      },
    })
    const physicsUser = await prisma.user.create({
      data: {
        name: 'Physics teacher',
        email: 'physics@example.com',
        passwordHash: '123456',
      },
    })

    const mathsSubject = await prisma.subject.create({
      data: {
        name: 'Maths',
      },
    })
    const physicsSubject = await prisma.subject.create({
      data: {
        name: 'Physics',
      },
    })

    await prisma.teacher.create({
      data: {
        price: 10,
        latitude: -25.8878476200255,
        longitude: 32.44430071970727,
        userId: mathsUser.id,
        subjectId: mathsSubject.id,
      },
    })

    await prisma.teacher.create({
      data: {
        price: 10,
        latitude: -25.75813186699103,
        longitude: 32.67643598129227,
        userId: physicsUser.id,
        subjectId: physicsSubject.id,
      },
    })

    const response = await request(app.server)
      .get(`/teachers/subjects/${mathsSubject.id}`)
      .query({
        page: 1,
      })
      .send()

    expect(response.status).toEqual(200)
    expect(response.body.teachers).toHaveLength(1)
    expect(response.body.teachers).toEqual([
      expect.objectContaining({
        user: expect.objectContaining({ name: 'Maths teacher' }),
        subject: expect.objectContaining({ name: 'Maths' }),
      }),
    ])
  })
})
