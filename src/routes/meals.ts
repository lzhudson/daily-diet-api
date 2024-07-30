import { FastifyInstance } from 'fastify'
import { knex } from '../database'
import { z } from 'zod'
import { randomUUID } from 'node:crypto'
import { checkUserIsLoggedIn } from '../middlewares/check-user-is-logged-in'
import { checkUserExists } from '../middlewares/check-user-exists'
import { checkMealExists } from '../middlewares/check-meal-exists'
import { getLongestConsecutiveDietSequence } from '../utils/getLongestConsecutiveDietSequence'

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
  app.get(
    '/',
    { preHandler: [checkUserIsLoggedIn, checkUserExists] },
    async (request) => {
      const { userId } = request.cookies

      const meals = await knex('meals').select('*').where({
        user_id: userId,
      })

      return {
        meals,
      }
    },
  )

  app.get('/:id', { preHandler: [checkMealExists] }, async (request) => {
    const meal = request.meal
    return {
      meal,
    }
  })

  app.put(
    '/:id',
    { preHandler: [checkUserIsLoggedIn, checkUserExists, checkMealExists] },
    async (request) => {
      const { meal } = request

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
          name: name || meal.name,
          description: description || meal.description,
          date_and_hour: dateAndHour || meal.date_and_hour,
          in_the_diet: isInTheDiet || meal.in_the_diet,
        })
        .where({
          id: meal.id,
        })
        .returning('*')

      return mealEdited[0]
    },
  )
  app.delete(
    '/:id',
    { preHandler: [checkUserIsLoggedIn, checkUserExists, checkMealExists] },
    async (request) => {
      const { meal } = request

      await knex('meals').delete('*').where({
        id: meal.id,
      })
    },
  )

  app.get(
    '/metrics',
    { preHandler: [checkUserIsLoggedIn, checkUserExists] },
    async (request) => {
      const { userId } = request.cookies

      const meals = await knex('meals').select('*').where({
        user_id: userId,
      })

      const mealsQuantity = meals.length

      const mealsInTheDiet = meals.reduce(
        (acc, currentValue) => {
          if (currentValue.in_the_diet) {
            acc.inTheDiet += 1
          } else {
            acc.offTheDiet += 1
          }

          return acc
        },
        {
          inTheDiet: 0,
          offTheDiet: 0,
        },
      )

      const sequenceMeals = getLongestConsecutiveDietSequence(meals)

      return {
        quantity: mealsQuantity,
        inTheDiet: mealsInTheDiet.inTheDiet,
        offTheDiet: mealsInTheDiet.offTheDiet,
        sequence: sequenceMeals,
      }
    },
  )
}
