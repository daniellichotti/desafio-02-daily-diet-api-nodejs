import { FastifyInstance } from 'fastify'
import { knex } from '../database'
import { z } from 'zod'
import { checkSessionIdExists } from '../middleware/check-session-id'

export async function mealsRoutes(app: FastifyInstance) {
  app.get(
    '/',
    {
      preHandler: [checkSessionIdExists],
    },
    async (request) => {
      const { sessionId } = request.cookies

      const userId = await knex('users')
        .where('session_id', sessionId)
        .select('id')
      console.log(userId[0].id)

      const users = await knex('meals').where('userId', userId).select()
      // .where('session_id', sessionId)

      return { users }
    },
  )

  app.post(
    '/',
    {
      preHandler: [checkSessionIdExists],
    },
    async (request, reply) => {
      const createMealBodySchema = z.object({
        mealName: z.string(),
        description: z.string(),
        onDiet: z.boolean(),
      })

      const { description, onDiet, mealName } = createMealBodySchema.parse(
        request.body,
      )

      const { sessionId } = request.cookies

      const userId = await knex('users')
        .where('session_id', sessionId)
        .select('id')
      console.log(userId[0].id)

      await knex('meals').insert({
        id: crypto.randomUUID(),
        userId: userId[0].id,
        mealName,
        description,
        onDiet,
      })

      return reply.status(201).send()
    },
  )
}
