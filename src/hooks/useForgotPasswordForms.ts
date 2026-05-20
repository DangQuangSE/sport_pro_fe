"use client"

import { useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslation } from './useTranslation'
import { forgotPasswordService } from '@/services/forgotPasswordService'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export type ForgotPasswordStep = 'REQUEST_OTP' | 'VERIFY_OTP' | 'RESET_PASSWORD'

export function useForgotPasswordForms() {
  const { t, locale } = useTranslation()
  const router = useRouter()
  
  const [isLoading, setIsLoading] = useState(false)
  const [step, setStep] = useState<ForgotPasswordStep>('REQUEST_OTP')
  const [email, setEmail] = useState('')
  const [forgotPasswordToken, setForgotPasswordToken] = useState('')

  const requestOtpSchema = z.object({
    email: z.string().min(1, { message: t('auth.emailRequired') }).email({ message: t('auth.emailInvalid') }),
  })

  const verifyOtpSchema = z.object({
    otpCode: z.string().length(6, { message: t('auth.otpInvalid') }),
  })

  const resetPasswordSchema = z.object({
    newPassword: z.string().min(8, { message: t('auth.passwordMin') }),
    confirmPassword: z.string().min(1, { message: t('auth.passwordRequired') })
  }).refine((data) => data.newPassword === data.confirmPassword, {
    message: t('auth.passwordsMatch'),
    path: ["confirmPassword"],
  })

  const requestOtpForm = useForm<z.infer<typeof requestOtpSchema>>({
    resolver: zodResolver(requestOtpSchema),
    defaultValues: { email: "" },
  })

  const verifyOtpForm = useForm<z.infer<typeof verifyOtpSchema>>({
    resolver: zodResolver(verifyOtpSchema),
    defaultValues: { otpCode: "" },
  })

  const resetPasswordForm = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { newPassword: "", confirmPassword: "" },
  })

  const onRequestOtp = async (values: z.infer<typeof requestOtpSchema>) => {
    setIsLoading(true)
    try {
      await forgotPasswordService.requestOtp(values.email)
      setEmail(values.email)
      toast.success(t('auth.forgotPasswordRequestSuccess') || "Mã OTP khôi phục đã được gửi tới email của bạn!")
      setStep('VERIFY_OTP')
    } catch (error: any) {
      console.error('Request OTP error', error)
      toast.error(error.message || "Gửi yêu cầu OTP thất bại. Vui lòng thử lại.")
    } finally {
      setIsLoading(false)
    }
  }

  const onVerifyOtp = async (values: z.infer<typeof verifyOtpSchema>) => {
    setIsLoading(true)
    try {
      const response = await forgotPasswordService.verifyOtp(email, values.otpCode)
      if (response.data && response.data.forgotPasswordToken) {
        setForgotPasswordToken(response.data.forgotPasswordToken)
        toast.success("Xác thực OTP khôi phục thành công!")
        setStep('RESET_PASSWORD')
      } else {
        throw new Error("Không nhận được token khôi phục.")
      }
    } catch (error: any) {
      console.error('Verify OTP error', error)
      toast.error(error.message || "Mã OTP không chính xác hoặc đã hết hạn.")
    } finally {
      setIsLoading(false)
    }
  }

  const onResetPassword = async (values: z.infer<typeof resetPasswordSchema>) => {
    setIsLoading(true)
    try {
      await forgotPasswordService.resetPassword(forgotPasswordToken, values.newPassword)
      toast.success(t('auth.resetPasswordSuccess') || "Khôi phục mật khẩu thành công! Vui lòng đăng nhập với mật khẩu mới.")
      router.push(`/${locale}/login`)
    } catch (error: any) {
      console.error('Reset password error', error)
      toast.error(error.message || "Đổi mật khẩu thất bại. Vui lòng thử lại.")
    } finally {
      setIsLoading(false)
    }
  }

  const onResendOtp = async () => {
    if (!email) return
    setIsLoading(true)
    try {
      await forgotPasswordService.requestOtp(email)
      toast.success(t('auth.otpSent') || "Mã OTP đã được gửi lại!")
    } catch (error: any) {
      console.error('Resend OTP error', error)
      toast.error(error.message || "Gửi lại OTP thất bại.")
    } finally {
      setIsLoading(false)
    }
  }

  return {
    requestOtpForm,
    verifyOtpForm,
    resetPasswordForm,
    onRequestOtp,
    onVerifyOtp,
    onResetPassword,
    onResendOtp,
    isLoading,
    step,
    email,
    setStep
  }
}
