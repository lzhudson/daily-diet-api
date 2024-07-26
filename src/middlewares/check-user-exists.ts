import { FastifyReply, FastifyRequest } from 'fastify'
import { knex } from '../database'

export async function checkUserExists(
  request: FastifyRequest,
  reply: FastifyReply,
) {
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
}
