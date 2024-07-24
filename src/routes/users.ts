import { FastifyInstance } from 'fastify'
import { knex } from '../database'
import { z } from 'zod'
import { randomUUID } from 'node:crypto'

export async function usersRoutes(app: FastifyInstance) {
  app.post('/', async (request, reply) => {
    const createUserBodySchema = z.object({
      username: z.string(),
    })

    const { username } = createUserBodySchema.parse(request.body)

    const usernameAlreadyExists = await knex('users')
      .where({
        username,
      })
      .first()

    if (usernameAlreadyExists) {
      return reply.status(400).send({
        error: 'Username already exists!',
      })
    }

    const userData = {
      id: randomUUID(),
      username,
    }

    await knex('users').insert(userData)

    return reply.status(201).send()
  })
}
