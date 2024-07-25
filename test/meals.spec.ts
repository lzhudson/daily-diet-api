import { expect, beforeAll, afterAll, describe, it, beforeEach } from 'vitest'
import { execSync } from 'node:child_process'
import request from 'supertest'
import { app } from '../src/server'
import { randomUUID } from 'node:crypto'

describe('Meals routes', async () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  beforeEach(() => {
    execSync('npm run knex migrate:rollback --all')
    execSync('npm run knex migrate:latest')
  })

  it('should be able to create a meal', async () => {
    const username = 'lzhudson'

    await request(app.server).post('/users').send({
      username,
    })

    const signInResponse = await request(app.server).post('/login').send({
      username,
    })

    const cookies = signInResponse.get('Set-Cookie') ?? []
    const userId = cookies[0]
      .split(';')
      .find((element) => element.includes('userId'))
      ?.split('=')[1]

    const responseCreateNewMeal = await request(app.server)
      .post('/meals')
      .set('Cookie', cookies)
      .send({
        id: randomUUID(),
        name: 'Café da manhã',
        description: 'Pão, ovos e café',
        dateAndHour: new Date().toISOString(),
        isInTheDiet: true,
        user_id: userId,
      })

    console.log(responseCreateNewMeal)

    expect(responseCreateNewMeal.statusCode).toEqual(201)
  })

  it('must not be able to create meals if the user is not logged in', async () => {
    const responseCreateNewMeal = await request(app.server)
      .post('/meals')
      .send({
        id: randomUUID(),
        name: 'Café da manhã',
        description: 'Pão, ovos e café',
        dateAndHour: new Date().toISOString(),
        isInTheDiet: true,
      })

    console.log(responseCreateNewMeal)

    expect(responseCreateNewMeal.statusCode).toEqual(401)
  })
})
