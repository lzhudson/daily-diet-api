import { expect, beforeAll, afterAll, describe, it, beforeEach } from 'vitest'
import { execSync } from 'node:child_process'
import request from 'supertest'
import { app } from '../src/server'

describe('Users routes', async () => {
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

  it('should be able to create a new user', async () => {
    const response = await request(app.server).post('/users').send({
      username: 'lzhudson',
    })

    expect(response.statusCode).toEqual(201)
  })

  it('should be able to create a new user if username already exists', async () => {
    await request(app.server).post('/users').send({
      username: 'lzhudson',
    })

    const createSecondUserWithSameUsernameFromFirstUsers = await request(
      app.server,
    )
      .post('/users')
      .send({
        username: 'lzhudson',
      })

    expect(createSecondUserWithSameUsernameFromFirstUsers.statusCode).toEqual(
      400,
    )
  })
})
