import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { app } from '@/app'
import { prisma } from '@/lib/prisma'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'

describe('Register teacher (E2E)', () => {
  beforeAll(async () => {
    await app.ready()
  })
  afterAll(async () => {
    await app.close()
  })

  it('Should be able to register a user as teacher', async () => {
    const { token } = await createAndAuthenticateUser(app)

    const subject = await prisma.subject.create({
      data: {
        name: 'Maths',
      },
    })

    const response = await request(app.server)
      .post('/teachers')
      .set('Authorization', `Bearer ${token}`)
      .send({
        description: '',
        longitude: 0,
        latitude: 0,
        subjectId: subject.id,
        price: 10,
      })

    expect(response.statusCode).toEqual(201)
    expect(response.body.teacher).toEqual(
      expect.objectContaining({ id: expect.any(String) }),
    )
  })
})
