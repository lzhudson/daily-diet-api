import { FastifyReply, FastifyRequest } from 'fastify'
import { knex } from '../database'
import { z } from 'zod'

export async function checkMealExists(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { userId } = request.cookies
  const getMealParamsSchema = z.object({
    id: z.string().uuid(),
  })
  const { id } = getMealParamsSchema.parse(request.params)

  const mealExists = await knex('meals')
    .where({
      id,
      user_id: userId,
    })
    .select('*')
    .first()

  if (!mealExists) {
    return reply.status(400).send({
      error: 'Meal not exists',
    })
  }

  request.meal = mealExists
}
