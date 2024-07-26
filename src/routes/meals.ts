import { FastifyInstance } from 'fastify'
import { knex } from '../database'
import { z } from 'zod'
import { randomUUID } from 'node:crypto'
import { checkUserIsLoggedIn } from '../middlewares/check-user-is-logged-in'
import { checkUserExists } from '../middlewares/check-user-exists'

export async function mealsRoutes(app: FastifyInstance) {
  app.post(
    '/',
    { preHandler: [checkUserIsLoggedIn, checkUserExists] },
    async (request, reply) => {
      const createMealBodySchema = z.object({
        name: z.string(),
        description: z.string(),
        dateAndHour: z.string(),
        isInTheDiet: z.boolean(),
      })

      const { userId } = request.cookies

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

      const meal = await knex('meals').insert(mealData).returning('*')

      reply.code(201).send(meal)
    },
  )
  app.put(
    '/:id',
    { preHandler: [checkUserIsLoggedIn, checkUserExists] },
    async (request, reply) => {
      const getMealParamsSchema = z.object({
        id: z.string().uuid(),
      })

      const { id } = getMealParamsSchema.parse(request.params)

      const mealExists = await knex('meals')
        .where({
          id,
        })
        .select('*')
        .first()

      if (!mealExists) {
        return reply.status(400).send({
          error: 'Meal not exists',
        })
      }

      const editMealBodySchema = z.object({
        name: z.string().optional(),
        description: z.string().optional(),
        dateAndHour: z.string().optional(),
        isInTheDiet: z.boolean().optional(),
      })

      const { name, description, dateAndHour, isInTheDiet } =
        editMealBodySchema.parse(request.body)

      const mealEdited = await knex('meals')
        .update({
          name: name || mealExists.name,
          description: description || mealExists.description,
          date_and_hour: dateAndHour || mealExists.date_and_hour,
          in_the_diet: isInTheDiet || mealExists.in_the_diet,
        })
        .where({
          id,
        })
        .returning('*')

      return mealEdited[0]
    },
  )
}
