"use client"

import { useState, useEffect } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslation } from './useTranslation'
import { authService } from '@/services/authService'
import { useRouter } from 'next/navigation'

export type AuthStep = 'REQUEST_OTP' | 'VERIFY_OTP' | 'REGISTER'

export function useAuth() {
  const { t, locale } = useTranslation()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [step, setStep] = useState<AuthStep>('REQUEST_OTP')
  const [email, setEmail] = useState('')
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  // Check auth state on mount
  useEffect(() => {
    const token = localStorage.getItem("accessToken")
    setIsLoggedIn(!!token)
  }, [])

  const loginSchema = z.object({
    email: z.string().min(1, { message: t('auth.emailRequired') }).email({ message: t('auth.emailInvalid') }),
    password: z.string().min(1, { message: t('auth.passwordRequired') }),
  })

  const requestOtpSchema = z.object({
    email: z.string().min(1, { message: t('auth.emailRequired') }).email({ message: t('auth.emailInvalid') }),
  })

  const verifyOtpSchema = z.object({
    otpCode: z.string().length(6, { message: t('auth.otpInvalid') }),
  })

  const registerSchema = z.object({
    password: z.string().min(8, { message: t('auth.passwordMin') }),
    confirmPassword: z.string().min(1, { message: t('auth.passwordRequired') })
  }).refine((data) => data.password === data.confirmPassword, {
    message: t('auth.passwordsMatch'),
    path: ["confirmPassword"],
  })

  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  })

  const requestOtpForm = useForm<z.infer<typeof requestOtpSchema>>({
    resolver: zodResolver(requestOtpSchema),
    defaultValues: { email: "" },
  })

  const verifyOtpForm = useForm<z.infer<typeof verifyOtpSchema>>({
    resolver: zodResolver(verifyOtpSchema),
    defaultValues: { otpCode: "" },
  })

  const registerForm = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: { password: "", confirmPassword: "" },
  })

  const onLogin = async (values: z.infer<typeof loginSchema>) => {
    setIsLoading(true)
    try {
      await authService.login(values)
      router.push(`/${locale}`)
    } catch (error: any) {
      console.error('Login error', error)
      alert(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const onRequestOtp = async (values: z.infer<typeof requestOtpSchema>) => {
    setIsLoading(true)
    try {
      await authService.requestOtp(values.email)
      setEmail(values.email)
      setStep('VERIFY_OTP')
    } catch (error: any) {
      console.error('Request OTP error', error)
      alert(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const onVerifyOtp = async (values: z.infer<typeof verifyOtpSchema>) => {
    setIsLoading(true)
    try {
      await authService.verifyOtp(email, values.otpCode)
      setStep('REGISTER')
    } catch (error: any) {
      console.error('Verify OTP error', error)
      alert(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const onRegister = async (values: z.infer<typeof registerSchema>) => {
    setIsLoading(true)
    try {
      await authService.register({
        email,
        password: values.password
      })
      router.push(`/${locale}/login`)
    } catch (error: any) {
      console.error('Register error', error)
      alert(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const onLogout = async () => {
    setIsLoading(true)
    try {
      await authService.logout()
      setIsLoggedIn(false)
      router.push(`/${locale}`)
      router.refresh()
    } catch (error: any) {
      console.error('Logout error', error)
    } finally {
      setIsLoading(false)
    }
  }

  return {
    loginForm,
    requestOtpForm,
    verifyOtpForm,
    registerForm,
    onLogin,
    onRequestOtp,
    onVerifyOtp,
    onRegister,
    onLogout,
    isLoading,
    isLoggedIn,
    step,
    email
  }
}
