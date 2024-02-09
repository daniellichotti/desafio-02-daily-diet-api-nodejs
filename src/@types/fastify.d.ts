// FastifyRequestContext
import 'fastify'

declare module 'fastify' {
  export interface FastifyRequest {
    user?: {
      id: string
      userName: string
      userEmail: string
      session_id: string
    }
  }
}
