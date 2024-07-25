import { FastifyInstance } from 'fastify'
import { knex } from '../database'
import { z } from 'zod'
import { randomUUID } from 'node:crypto'
import { checkUserIsLoggedIn } from '../middlewares/check-user-is-logged-in'

export async function mealsRoutes(app: FastifyInstance) {
  app.post(
    '/',
    { preHandler: [checkUserIsLoggedIn] },
    async (request, reply) => {
      const createMealBodySchema = z.object({
        name: z.string(),
        description: z.string(),
        dateAndHour: z.string(),
        isInTheDiet: z.boolean(),
      })

      const { userId } = request.cookies

      const userExists = await knex('users')
        .where({
          id: userId,
        })
        .first()

      if (!userExists) {
        return reply.status(400).send({
          error: 'User not exists',
        })
      }

      const { name, description, dateAndHour, isInTheDiet } =
        createMealBodySchema.parse(request.body)

      const mealData = {
        id: randomUUID(),
        name,
        description,
        date_and_hour: dateAndHour,
        in_the_diet: isInTheDiet,
        user_id: userId,
      }

      await knex('meals').insert(mealData)

      return reply.status(201).send()
    },
  )
}
