import { authMiddleware } from '../middlewares/auth'
import { base } from './base'

export const authorized = base.use(authMiddleware)
