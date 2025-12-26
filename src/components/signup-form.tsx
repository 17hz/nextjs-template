'use client'

import { AlertCircle, GalleryVerticalEnd } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { emailOtp, signIn, signUp } from '@/lib/auth-client'
import { cn } from '@/lib/utils'

type Step = 'register' | 'verify'

export function SignupForm({ className, ...props }: React.ComponentProps<'div'>) {
  const [step, setStep] = useState<Step>('register')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [otp, setOtp] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }

    setIsLoading(true)

    const result = await signUp.email({
      email,
      password,
      name: email.split('@')[0],
    })

    if (result.error) {
      setError(result.error.message ?? 'Registration failed')
      setIsLoading(false)
      return
    }

    const otpResult = await emailOtp.sendVerificationOtp({
      email,
      type: 'email-verification',
    })

    if (otpResult.error) {
      setError(otpResult.error.message ?? 'Failed to send verification code')
      setIsLoading(false)
      return
    }

    setIsLoading(false)
    setStep('verify')
  }

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    const result = await emailOtp.verifyEmail({
      email,
      otp,
    })

    if (result.error) {
      setError(result.error.message ?? 'Invalid verification code')
      setIsLoading(false)
      return
    }

    router.push('/')
  }

  const handleResendOtp = async () => {
    setError('')
    setIsLoading(true)

    const result = await emailOtp.sendVerificationOtp({
      email,
      type: 'email-verification',
    })

    if (result.error) {
      setError(result.error.message ?? 'Failed to resend verification code')
    }

    setIsLoading(false)
  }

  const handleGoogleSignup = async () => {
    await signIn.social({ provider: 'google', callbackURL: '/' })
  }

  if (step === 'verify') {
    return (
      <div className={cn('flex flex-col gap-6', className)} {...props}>
        <form onSubmit={handleVerify}>
          <FieldGroup>
            <div className="flex flex-col items-center gap-2 text-center">
              <a href="#" className="flex flex-col items-center gap-2 font-medium">
                <div className="flex size-8 items-center justify-center rounded-md">
                  <GalleryVerticalEnd className="size-6" />
                </div>
                <span className="sr-only">Acme Inc.</span>
              </a>
              <h1 className="font-bold text-xl">Verify your email</h1>
              <FieldDescription>
                We sent a verification code to <strong>{email}</strong>
              </FieldDescription>
            </div>
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <Field>
              <FieldLabel htmlFor="otp">Verification Code</FieldLabel>
              <Input
                id="otp"
                type="text"
                placeholder="123456"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                disabled={isLoading}
                maxLength={6}
                required
              />
              <FieldDescription>Enter the 6-digit code from your email</FieldDescription>
            </Field>
            <Field>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Verifying...' : 'Verify Email'}
              </Button>
            </Field>
            <Field>
              <Button type="button" variant="ghost" onClick={handleResendOtp} disabled={isLoading}>
                Resend Code
              </Button>
            </Field>
          </FieldGroup>
        </form>
      </div>
    )
  }

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <form onSubmit={handleRegister}>
        <FieldGroup>
          <div className="flex flex-col items-center gap-2 text-center">
            <a href="#" className="flex flex-col items-center gap-2 font-medium">
              <div className="flex size-8 items-center justify-center rounded-md">
                <GalleryVerticalEnd className="size-6" />
              </div>
              <span className="sr-only">Acme Inc.</span>
            </a>
            <h1 className="font-bold text-xl">Join us today</h1>
            <FieldDescription>
              Already have an account? <a href="/signin">Sign in</a>
            </FieldDescription>
          </div>
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <Field>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              required
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              required
            />
            <FieldDescription>At least 8 characters strong.</FieldDescription>
          </Field>
          <Field>
            <FieldLabel htmlFor="confirm-password">Confirm Password</FieldLabel>
            <Input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={isLoading}
              required
            />
            <FieldDescription>Just to be sure.</FieldDescription>
          </Field>
          <Field>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Creating account...' : 'Sign Up'}
            </Button>
          </Field>
          <FieldSeparator>Or</FieldSeparator>
          <Field className="grid gap-4 sm:grid-cols-1">
            <Button variant="outline" type="button" onClick={handleGoogleSignup}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path
                  d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                  fill="currentColor"
                />
              </svg>
              Continue with Google
            </Button>
          </Field>
        </FieldGroup>
      </form>
      <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our <a href="#">Terms of Service</a> and{' '}
        <a href="#">Privacy Policy</a>.
      </FieldDescription>
    </div>
  )
}
