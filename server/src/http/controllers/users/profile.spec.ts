import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { app } from '@/app'

describe('Profile (E2E)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('Should be able to get the user profile', async () => {
    await request(app.server).post('/users').send({
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      password: '123456',
    })

    const authResponse = await request(app.server).post('/sessions').send({
      email: 'johndoe@gmail.com',
      password: '123456',
    })

    const response = await request(app.server)
      .get('/me')
      .set('Authorization', `Bearer ${authResponse.body.token}`)
      .send()

    expect(response.status).toEqual(200)
    expect(response.body).toEqual({
      user: expect.objectContaining({
        name: 'John Doe',
        email: 'johndoe@gmail.com',
      }),
    })
  })
})
