import { FastifyInstance } from 'fastify'
import { knex } from '../database'
import { z } from 'zod'

export async function authRoutes(app: FastifyInstance) {
  app.post('/login', async (request, reply) => {
    const loginUserBodySchema = z.object({
      username: z.string(),
    })

    const { username } = loginUserBodySchema.parse(request.body)

    const userExists = await knex('users')
      .where({
        username,
      })
      .first()

    if (!userExists) {
      return reply.status(400).send({
        error: 'User not found!',
      })
    }

    return reply
      .cookie('userId', userExists.id, {
        path: '/',
        maxAge: 60 * 60 * 60 * 24 * 7, // 7 Days
      })
      .status(200)
      .send()
  })
}
