import { eq } from 'drizzle-orm'
import * as z from 'zod'
import db from '@/database/db'
import { user } from '@/database/schemas/betterAuth'
import { base } from '../builders/base'

export const listUsers = base
  .input(
    z.object({
      limit: z.number().int().min(1).max(100).optional(),
    }),
  )
  .handler(async ({ input }) => {
    const limit = input.limit ?? 10
    const users = await db.select().from(user).limit(limit)
    return users
  })

export const findUser = base.input(z.object({ id: z.string() })).handler(async ({ input }) => {
  const result = await db.select().from(user).where(eq(user.id, input.id))
  if (result.length === 0) {
    throw new Error('User not found')
  }
  return result[0]
})
