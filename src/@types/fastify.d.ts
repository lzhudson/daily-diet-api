import { Meal } from './meal'

declare module 'fastify' {
  interface FastifyRequest {
    meal: Meal
  }
}
