import { drizzle } from 'drizzle-orm/neon-http'
import * as schema from './schemas'

const db = drizzle(process.env.DATABASE_URL!, { schema: schema })

export default db
