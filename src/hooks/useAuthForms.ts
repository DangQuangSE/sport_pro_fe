"use client"

import { useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslation } from './useTranslation'
import { authService } from '@/services/authService'
import { useRouter } from 'next/navigation'
import { useAuthContext } from '@/contexts/AuthContext'
import { toast } from 'sonner'
import { ApiError } from '@/lib/api-client'

export type AuthStep = 'REQUEST_OTP' | 'VERIFY_OTP' | 'REGISTER'

export function useAuthForms() {
  const { t, locale } = useTranslation()
  const router = useRouter()
  const { login: contextLogin } = useAuthContext()
  
  const [isLoading, setIsLoading] = useState(false)
  const [step, setStep] = useState<AuthStep>('REQUEST_OTP')
  const [email, setEmail] = useState('')

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
      const response = await authService.login(values)
      if (response.data && response.data.accessToken) {
        await contextLogin(response.data.accessToken)
        toast.success(t('auth.loginSuccess') || "Đăng nhập thành công!")
        router.push(`/${locale}`)
      }
    } catch (error: any) {
      if (!(error instanceof ApiError && error.status === 401)) {
        console.error('Login error', error)
      }
      toast.error(error.message || "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.")
    } finally {
      setIsLoading(false)
    }
  }

  const onRequestOtp = async (values: z.infer<typeof requestOtpSchema>) => {
    setIsLoading(true)
    try {
      await authService.requestOtp(values.email)
      setEmail(values.email)
      toast.success(t('auth.otpSent') || "Mã OTP đã được gửi đến email của bạn!")
      setStep('VERIFY_OTP')
    } catch (error: any) {
      console.error('Request OTP error', error)
      toast.error(error.message || "Gửi OTP thất bại. Vui lòng thử lại.")
    } finally {
      setIsLoading(false)
    }
  }

  const onVerifyOtp = async (values: z.infer<typeof verifyOtpSchema>) => {
    setIsLoading(true)
    try {
      await authService.verifyOtp(email, values.otpCode)
      toast.success("Xác thực OTP thành công!")
      setStep('REGISTER')
    } catch (error: any) {
      console.error('Verify OTP error', error)
      toast.error(error.message || "Mã OTP không chính xác hoặc đã hết hạn.")
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
      toast.success("Đăng ký tài khoản thành công! Vui lòng đăng nhập.")
      router.push(`/${locale}/login`)
    } catch (error: any) {
      console.error('Register error', error)
      toast.error(error.message || "Đăng ký thất bại. Vui lòng thử lại.")
    } finally {
      setIsLoading(false)
    }
  }

  const onResendOtp = async () => {
    if (!email) return
    setIsLoading(true)
    try {
      await authService.resendOtp(email)
      toast.success(t('auth.otpSent') || "Mã OTP đã được gửi lại!")
    } catch (error: any) {
      console.error('Resend OTP error', error)
      toast.error(error.message || "Gửi lại OTP thất bại.")
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
    onResendOtp,
    isLoading,
    step,
    email
  }
}
