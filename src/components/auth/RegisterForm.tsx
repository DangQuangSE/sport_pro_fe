"use client"

import { useTranslation } from "@/hooks/useTranslation"
import { useAuth } from "@/hooks/useAuth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Mail, Lock, ArrowRight, Loader2, ShieldCheck, KeyRound } from "lucide-react"
import Link from "next/link"

export function RegisterForm() {
  const { t, locale } = useTranslation()
  const { 
    requestOtpForm, verifyOtpForm, registerForm, 
    onRequestOtp, onVerifyOtp, onRegister, 
    isLoading, step, email 
  } = useAuth()

  return (
    <div className="w-full max-w-[440px] bg-surface-container-lowest rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.06)] border border-outline-variant p-8 lg:p-12 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-secondary-container to-primary"></div>
      
      {step === 'REQUEST_OTP' && (
        <>
          <div className="text-center mb-8">
            <h1 className="font-display-lg text-display-lg font-black italic tracking-tighter text-on-surface mb-2">{t('auth.registerTitle')}</h1>
            <p className="font-body-sm text-body-sm text-on-surface-variant">{t('auth.registerSubtitle')}</p>
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
                  {t('auth.registerButton')}
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </Button>
          </form>
        </>
      )}

      {step === 'VERIFY_OTP' && (
        <>
          <div className="text-center mb-8">
            <h1 className="font-display-lg text-display-lg font-black italic tracking-tighter text-on-surface mb-2">{t('auth.otpTitle')}</h1>
            <p className="font-body-sm text-body-sm text-on-surface-variant">{t('auth.otpSubtitle')}</p>
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
          </form>
        </>
      )}

      {step === 'REGISTER' && (
        <>
          <div className="text-center mb-8">
            <h1 className="font-display-lg text-display-lg font-black italic tracking-tighter text-on-surface mb-2">{t('auth.registerFinalTitle')}</h1>
            <p className="font-body-sm text-body-sm text-on-surface-variant">{t('auth.registerFinalSubtitle')}</p>
          </div>
          
          <form onSubmit={registerForm.handleSubmit(onRegister)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="password">{t('auth.passwordLabel')}</Label>
              <Input 
                id="password" 
                type="password" 
                placeholder={t('auth.passwordPlaceholder')} 
                icon={<Lock className="w-5 h-5" />}
                {...registerForm.register("password")}
              />
              {registerForm.formState.errors.password && (
                <p className="text-error text-sm mt-1">{registerForm.formState.errors.password.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">{t('auth.confirmPasswordLabel')}</Label>
              <Input 
                id="confirmPassword" 
                type="password" 
                placeholder={t('auth.passwordPlaceholder')} 
                icon={<KeyRound className="w-5 h-5" />}
                {...registerForm.register("confirmPassword")}
              />
              {registerForm.formState.errors.confirmPassword && (
                <p className="text-error text-sm mt-1">{registerForm.formState.errors.confirmPassword.message}</p>
              )}
            </div>

            <Button type="submit" className="w-full mt-8 flex items-center justify-center gap-2" disabled={isLoading}>
              {isLoading ? <Loader2 className="animate-spin w-5 h-5" /> : (
                <>
                  {t('auth.registerButton')}
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </Button>
          </form>
        </>
      )}

      <p className="mt-8 text-center font-body-sm text-body-sm text-on-surface-variant">
        {t('auth.alreadyHaveAccount')}{" "}
        <Link href={`/${locale}/login`} className="font-label-sm text-label-sm text-primary uppercase tracking-wider ml-1 hover:underline decoration-2 underline-offset-4">
          {t('auth.signInButton')}
        </Link>
      </p>
    </div>
  )
}
