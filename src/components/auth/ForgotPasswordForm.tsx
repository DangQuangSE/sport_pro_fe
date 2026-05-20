"use client"

import { useState, useEffect } from "react"
import { useTranslation } from "@/hooks/useTranslation"
import { useForgotPasswordForms } from "@/hooks/useForgotPasswordForms"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Mail, Lock, ArrowRight, Loader2, ShieldCheck, KeyRound, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"

export function ForgotPasswordForm() {
  const { t, locale } = useTranslation()
  const { 
    requestOtpForm, verifyOtpForm, resetPasswordForm, 
    onRequestOtp, onVerifyOtp, onResetPassword, onResendOtp,
    isLoading, step, email, setStep 
  } = useForgotPasswordForms()

  const [countdown, setCountdown] = useState(0)

  useEffect(() => {
    if (countdown > 0 && step === 'VERIFY_OTP') {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [countdown, step])

  const handleResend = () => {
    if (countdown === 0) {
      onResendOtp()
      setCountdown(60)
    }
  }

  // Animation variants with spring physics
  const slideVariants = {
    initial: { opacity: 0, x: 20 },
    animate: { 
      opacity: 1, 
      x: 0,
      transition: { type: "spring" as const, stiffness: 100, damping: 20 }
    },
    exit: { 
      opacity: 0, 
      x: -20,
      transition: { duration: 0.15 }
    }
  }

  return (
    <div className="w-full max-w-[440px] bg-surface-container-lowest rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.06)] border border-outline-variant p-8 lg:p-12 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-secondary-container to-primary"></div>
      
      <AnimatePresence mode="wait">
        {step === 'REQUEST_OTP' && (
          <motion.div
            key="request-otp"
            variants={slideVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <div className="text-center mb-8">
              <h1 className="font-display-lg text-display-lg font-black italic tracking-tighter text-on-surface mb-2">
                {t('auth.forgotPasswordTitle')}
              </h1>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                {t('auth.forgotPasswordSubtitle')}
              </p>
            </div>
            
            <form onSubmit={requestOtpForm.handleSubmit(onRequestOtp)} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">{t('auth.emailLabel')}</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder={t('auth.emailPlaceholder')} 
                  icon={<Mail className="w-5 h-5" />}
                  {...requestOtpForm.register("email")}
                />
                {requestOtpForm.formState.errors.email && (
                  <p className="text-error text-sm mt-1">{requestOtpForm.formState.errors.email.message}</p>
                )}
              </div>

              <Button type="submit" className="w-full mt-8 flex items-center justify-center gap-2" disabled={isLoading}>
                {isLoading ? <Loader2 className="animate-spin w-5 h-5" /> : (
                  <>
                    {t('auth.forgotPasswordRequestButton')}
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </Button>
            </form>
          </motion.div>
        )}

        {step === 'VERIFY_OTP' && (
          <motion.div
            key="verify-otp"
            variants={slideVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <div className="mb-6">
              <button 
                type="button" 
                onClick={() => setStep('REQUEST_OTP')}
                className="flex items-center gap-1.5 text-sm font-medium text-on-surface-variant hover:text-primary transition-colors cursor-pointer group"
              >
                <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
                {locale === 'vi' ? 'Quay lại' : 'Back'}
              </button>
            </div>

            <div className="text-center mb-8">
              <h1 className="font-display-lg text-display-lg font-black italic tracking-tighter text-on-surface mb-2">
                {t('auth.forgotPasswordVerifyTitle')}
              </h1>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                {t('auth.forgotPasswordVerifySubtitle')}
              </p>
              <p className="font-label-md text-label-md text-primary mt-1">{email}</p>
            </div>
            
            <form onSubmit={verifyOtpForm.handleSubmit(onVerifyOtp)} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="otpCode">{t('auth.otpLabel')}</Label>
                <Input 
                  id="otpCode" 
                  placeholder={t('auth.otpPlaceholder')} 
                  icon={<ShieldCheck className="w-5 h-5" />}
                  {...verifyOtpForm.register("otpCode")}
                />
                {verifyOtpForm.formState.errors.otpCode && (
                  <p className="text-error text-sm mt-1">{verifyOtpForm.formState.errors.otpCode.message}</p>
                )}
              </div>

              <Button type="submit" className="w-full mt-8 flex items-center justify-center gap-2" disabled={isLoading}>
                {isLoading ? <Loader2 className="animate-spin w-5 h-5" /> : (
                  <>
                    {t('auth.verifyButton')}
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </Button>

              <div className="text-center mt-6">
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={countdown > 0 || isLoading}
                  className="font-label-sm text-label-sm text-primary disabled:text-on-surface-variant/40 disabled:no-underline uppercase tracking-wider hover:underline decoration-2 underline-offset-4 cursor-pointer disabled:cursor-not-allowed"
                >
                  {countdown > 0 ? `${t('auth.resendOtp')} (${countdown}s)` : t('auth.resendOtp')}
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {step === 'RESET_PASSWORD' && (
          <motion.div
            key="reset-password"
            variants={slideVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <div className="text-center mb-8">
              <h1 className="font-display-lg text-display-lg font-black italic tracking-tighter text-on-surface mb-2">
                {t('auth.resetPasswordTitle')}
              </h1>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                {t('auth.resetPasswordSubtitle')}
              </p>
            </div>
            
            <form onSubmit={resetPasswordForm.handleSubmit(onResetPassword)} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="newPassword">{t('auth.newPasswordLabel')}</Label>
                <Input 
                  id="newPassword" 
                  type="password" 
                  placeholder={t('auth.newPasswordPlaceholder')} 
                  icon={<Lock className="w-5 h-5" />}
                  {...resetPasswordForm.register("newPassword")}
                />
                {resetPasswordForm.formState.errors.newPassword && (
                  <p className="text-error text-sm mt-1">{resetPasswordForm.formState.errors.newPassword.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">{t('auth.confirmPasswordLabel')}</Label>
                <Input 
                  id="confirmPassword" 
                  type="password" 
                  placeholder={t('auth.passwordPlaceholder')} 
                  icon={<KeyRound className="w-5 h-5" />}
                  {...resetPasswordForm.register("confirmPassword")}
                />
                {resetPasswordForm.formState.errors.confirmPassword && (
                  <p className="text-error text-sm mt-1">{resetPasswordForm.formState.errors.confirmPassword.message}</p>
                )}
              </div>

              <Button type="submit" className="w-full mt-8 flex items-center justify-center gap-2" disabled={isLoading}>
                {isLoading ? <Loader2 className="animate-spin w-5 h-5" /> : (
                  <>
                    {t('auth.resetPasswordButton')}
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </Button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <p className="mt-8 text-center font-body-sm text-body-sm text-on-surface-variant">
        {t('auth.alreadyHaveAccount')}{" "}
        <Link href={`/${locale}/login`} className="font-label-sm text-label-sm text-primary uppercase tracking-wider ml-1 hover:underline decoration-2 underline-offset-4">
          {t('auth.signInButton')}
        </Link>
      </p>
    </div>
  )
}
