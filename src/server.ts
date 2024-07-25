import fastify from 'fastify'
import { usersRoutes } from './routes/users'
import fastifyCookie from '@fastify/cookie'
import { authRoutes } from './routes/auth'
import { mealsRoutes } from './routes/meals'

export const app = fastify()

app.register(fastifyCookie)
app.register(authRoutes)
app.register(usersRoutes, { prefix: 'users' })
app.register(mealsRoutes, { prefix: 'meals' })

app
  .listen({
    port: 3333,
  })
  .then(() => {
    console.log('HTTP Server Running!')
  })
