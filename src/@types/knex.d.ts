import { Knex } from 'knex'

declare module 'knex/types/tables' {
  export interface Tables {
    users: {
      id: string
      userName: string
      session_id: string
    }
    meals: {
      id: string
      userId: string
      mealName: string
      dateAndTime: string
      description: string
      onDiet: boolean
    }
  }
}
