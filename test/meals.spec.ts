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

    expect(responseCreateNewMeal.statusCode).toEqual(401)
  })

  it('should be able to list a meals from logged user', async () => {
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

    await request(app.server).post('/meals').set('Cookie', cookies).send({
      id: randomUUID(),
      name: 'Café da manhã',
      description: 'Pão, ovos e café',
      dateAndHour: new Date().toISOString(),
      isInTheDiet: true,
      user_id: userId,
    })

    await request(app.server).post('/meals').set('Cookie', cookies).send({
      id: randomUUID(),
      name: 'Café da manhã',
      description: 'Pão, ovos e café',
      dateAndHour: new Date().toISOString(),
      isInTheDiet: true,
      user_id: userId,
    })

    const response = await request(app.server)
      .get('/meals')
      .set('Cookie', cookies)

    const { meals } = response.body

    expect(meals).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          user_id: userId,
        }),
      ]),
    )
  })

  it('must be able to list only one meal by id', async () => {
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

    const createMealResponse = await request(app.server)
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

    const response = await request(app.server)
      .get(`/meals/${createMealResponse.body[0].id}`)
      .set('Cookie', cookies)

    const { meal } = response.body

    expect(meal).toEqual(
      expect.objectContaining({
        name: 'Café da manhã',
        description: 'Pão, ovos e café',
        in_the_diet: 1,
      }),
    )
  })

  it('should be able to edit a meal', async () => {
    const username = 'lzhudson'

    await request(app.server).post('/users').send({
      username,
    })

    const signInResponse = await request(app.server).post('/login').send({
      username,
    })

    const cookies = signInResponse.get('Set-Cookie') ?? []

    const responseCreateNewMeal = await request(app.server)
      .post('/meals')
      .set('Cookie', cookies)
      .send({
        name: 'Café da manhã',
        description: 'Pão, ovos e café',
        dateAndHour: new Date().toISOString(),
        isInTheDiet: true,
      })

    const { id } = responseCreateNewMeal.body[0]

    const mealDataEdited = {
      name: 'Café da manhã',
      description: 'Pão, queijo e presunto',
      dateAndHour: new Date().toISOString(),
      isInTheDiet: true,
    }

    const responseEditMeal = await request(app.server)
      .put(`/meals/${id}`)
      .set('Cookie', cookies)
      .send(mealDataEdited)

    expect(responseEditMeal.statusCode).toEqual(200)
  })

  it('should be able to delete a meal', async () => {
    const username = 'lzhudson'

    await request(app.server).post('/users').send({
      username,
    })

    const signInResponse = await request(app.server).post('/login').send({
      username,
    })

    const cookies = signInResponse.get('Set-Cookie') ?? []

    const responseCreateNewMeal = await request(app.server)
      .post('/meals')
      .set('Cookie', cookies)
      .send({
        name: 'Café da manhã',
        description: 'Pão, ovos e café',
        dateAndHour: new Date().toISOString(),
        isInTheDiet: true,
      })

    const { id } = responseCreateNewMeal.body[0]

    const responseDeleteMeal = await request(app.server)
      .delete(`/meals/${id}`)
      .set('Cookie', cookies)

    expect(responseDeleteMeal.statusCode).toEqual(200)
  })

  it('should be able to show the metrics', async () => {
    const username = 'lzhudson'

    await request(app.server).post('/users').send({
      username,
    })

    const signInResponse = await request(app.server).post('/login').send({
      username,
    })

    const cookies = signInResponse.get('Set-Cookie') ?? []

    await request(app.server).post('/meals').set('Cookie', cookies).send({
      name: 'Café da manhã',
      description: 'Pão de forma, ovos e café',
      dateAndHour: new Date().toISOString(),
      isInTheDiet: true,
    })
    await request(app.server).post('/meals').set('Cookie', cookies).send({
      name: 'Lanche pré almoço',
      description: 'Frutas com Iogurte natural',
      dateAndHour: new Date().toISOString(),
      isInTheDiet: true,
    })

    await request(app.server).post('/meals').set('Cookie', cookies).send({
      name: 'Almoço',
      description: 'Hamburguer Burguer King',
      dateAndHour: new Date().toISOString(),
      isInTheDiet: false,
    })

    await request(app.server).post('/meals').set('Cookie', cookies).send({
      name: 'Merenda da tarde',
      description: 'Banana, aveia e whey protein',
      dateAndHour: new Date().toISOString(),
      isInTheDiet: true,
    })

    await request(app.server).post('/meals').set('Cookie', cookies).send({
      name: 'Jantar',
      description: 'Frango desfiado, arroz, batata doce e salada',
      dateAndHour: new Date().toISOString(),
      isInTheDiet: true,
    })

    await request(app.server).post('/meals').set('Cookie', cookies).send({
      name: 'Ceia',
      description: 'Castanhas com leite desnatado',
      dateAndHour: new Date().toISOString(),
      isInTheDiet: true,
    })

    const metricsResponse = await request(app.server)
      .get('/meals/metrics')
      .set('Cookie', cookies)

    expect(metricsResponse.body).toEqual(
      expect.objectContaining({
        quantity: 6,
        inTheDiet: 5,
        offTheDiet: 1,
        sequence: 3,
      }),
    )
  })
})
