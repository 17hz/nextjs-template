import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

interface SendVerificationEmailParams {
  to: string
  otp: string
  type: "sign-in" | "email-verification" | "forget-password"
}

export async function sendVerificationEmail({
  to,
  otp,
  type,
}: SendVerificationEmailParams) {
  const subjects = {
    "sign-in": "Your sign-in code",
    "email-verification": "Verify your email",
    "forget-password": "Reset your password",
  }

  const { data, error } = await resend.emails.send({
    from: "Acme <onboarding@resend.dev>",
    to,
    subject: subjects[type],
    html: `
      <div style="font-family: sans-serif; max-width: 400px; margin: 0 auto; padding: 20px;">
        <h2 style="text-align: center; color: #333;">Verification Code</h2>
        <p style="text-align: center; color: #666;">Your verification code is:</p>
        <div style="background: #f4f4f4; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0;">
          <span style="font-size: 32px; font-weight: bold; letter-spacing: 4px; color: #333;">${otp}</span>
        </div>
        <p style="text-align: center; color: #999; font-size: 14px;">
          This code will expire in 5 minutes.
        </p>
      </div>
    `,
  })

  if (error) {
    console.error("Failed to send email:", error)
    throw new Error("Failed to send verification email")
  }

  return data
}
