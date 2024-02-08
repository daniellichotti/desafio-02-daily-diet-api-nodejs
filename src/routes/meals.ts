import { FastifyInstance } from 'fastify'
import { z } from 'zod'

export async function mealsRoutes(app: FastifyInstance) {
  app.post('/meals', async (request, reply) => {
    const createMealBodySchema = z.object({
      userId,
      mealName,
      dateAndTime,
      description,
      onDiet,
    })

    const {}
  })
}
