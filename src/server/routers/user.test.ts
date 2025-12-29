import { describe, expect, it } from 'bun:test'
import { call } from '@orpc/server'
import { findUser } from './user'

describe('user router', () => {
  const mockHeaders = new Headers()
  const context = { headers: mockHeaders }

  describe('findUser', () => {
    it('should find user by id', async () => {
      const result = await call(findUser, { id: 'OR8CI6GncagGK9vSiGxrsAR4HvvI66lE' }, { context })

      expect(result.id).toBe('OR8CI6GncagGK9vSiGxrsAR4HvvI66lE')
      expect(result.name).toBe('zhaker')
    })

    it('should throw error when user not found', async () => {
      await expect(call(findUser, { id: 'non-existent-id' }, { context })).rejects.toThrow(
        'User not found',
      )
    })
  })
})
