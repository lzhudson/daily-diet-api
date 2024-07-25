// eslint-disable-next-line
import { Knex } from 'knex'

declare module 'knex/types/tables' {
  export interface Tables {
    users: {
      id: string
      username: string
    }
    meals: {
      id: string
      name: string
      description: string
      date_and_hour: string
      in_the_diet: boolean
      user_id: string
    }
  }
}
