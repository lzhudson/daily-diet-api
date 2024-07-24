import fastify from 'fastify'
import { usersRoutes } from './routes/users'
import fastifyCookie from '@fastify/cookie'
import { authRoutes } from './routes/auth'

export const app = fastify()

app.register(fastifyCookie)
app.register(usersRoutes, { prefix: 'users' })
app.register(authRoutes)

app
  .listen({
    port: 3333,
  })
  .then(() => {
    console.log('HTTP Server Running!')
  })
