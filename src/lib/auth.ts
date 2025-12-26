import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { betterAuth } from 'better-auth/minimal'
import { emailOTP } from 'better-auth/plugins'
import db from '@/database/db'
import { sendVerificationEmail } from '@/lib/email'

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg',
  }),
  /**
   * Database joins is useful when Better-Auth needs to fetch related data from multiple tables in a single query.
   * Endpoints like /get-session, /get-full-organization and many others benefit greatly from this feature,
   * seeing upwards of 2x to 3x performance improvements depending on database latency.
   * Ref: https://www.better-auth.com/docs/adapters/drizzle#joins-experimental
   */
  experimental: { joins: true },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
  },
  user: {
    changeEmail: {
      enabled: true,
    },
    deleteUser: {
      enabled: true,
    },
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },
  plugins: [
    emailOTP({
      async sendVerificationOTP({ email, otp, type }) {
        await sendVerificationEmail({ to: email, otp, type })
      },
    }),
  ],
})
