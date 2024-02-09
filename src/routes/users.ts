import { FastifyInstance } from 'fastify'
import { knex } from '../database'
import { z } from 'zod'
import { randomUUID } from 'node:crypto'
import { checkSessionIdExists } from '../middleware/check-session-id'

export async function usersRoutes(app: FastifyInstance) {
  app.get(
    '/',
    {
      preHandler: [checkSessionIdExists],
    },
    async (request) => {
      const { sessionId } = request.cookies

      const users = await knex('users').where('session_id', sessionId).select()

      return { users }
    },
  )

  app.get(
    '/:id',
    {
      preHandler: [checkSessionIdExists],
    },
    async (request) => {
      const getUserParamsSchema = z.object({
        id: z.string().uuid(),
      })

      const { id } = getUserParamsSchema.parse(request.params)

      const { sessionId } = request.cookies

      const user = await knex('users')
        .where({
          session_id: sessionId,
          id,
        })
        .first()

      return { user }
    },
  )

  app.post('/', async (request, reply) => {
    const createUserBodySchema = z.object({
      user_name: z.string(),
    })

    const { user_name } = createUserBodySchema.parse(request.body)

    let sessionId = request.cookies.sessionId

    if (!sessionId) {
      sessionId = randomUUID()

      reply.setCookie('sessionId', sessionId, {
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
      })
      await knex('users').insert({
        id: randomUUID(),
        user_name,
        session_id: sessionId,
      })
    } else {
      reply.status(401).send({
        error: 'Unauthorized',
      })
    }

    return reply.status(201).send()
  })
}
