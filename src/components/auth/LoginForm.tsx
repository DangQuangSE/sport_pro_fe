"use client"

import { useTranslation } from "@/hooks/useTranslation"
import { useAuthForms } from "@/hooks/useAuthForms"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Mail, Lock, ArrowRight, Loader2 } from "lucide-react"
import Link from "next/link"

export function LoginForm() {
  const { t, locale } = useTranslation()
  const { loginForm, onLogin, isLoading } = useAuthForms()

  return (
    <div className="w-full max-w-[440px] bg-surface-container-lowest rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.06)] border border-outline-variant p-8 lg:p-12 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary-container"></div>
      <div className="text-center mb-8">
        <h1 className="font-display-lg text-display-lg font-black italic tracking-tighter text-on-surface mb-2">{t('auth.loginTitle')}</h1>
        <p className="font-body-sm text-body-sm text-on-surface-variant">{t('auth.loginSubtitle')}</p>
      </div>
      
      <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="email">{t('auth.emailLabel')}</Label>
          <Input 
            id="email" 
            type="email" 
            placeholder={t('auth.emailPlaceholder')} 
            icon={<Mail className="w-5 h-5" />}
            {...loginForm.register("email")}
          />
          {loginForm.formState.errors.email && (
            <p className="text-error text-sm mt-1">{loginForm.formState.errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-baseline">
            <Label htmlFor="password">{t('auth.passwordLabel')}</Label>
            <Link href={`/${locale}/forgot-password`} className="font-label-sm text-label-sm text-primary hover:text-surface-tint transition-colors uppercase tracking-wider">
              {t('auth.forgotPassword')}
            </Link>
          </div>
          <Input 
            id="password" 
            type="password" 
            placeholder={t('auth.passwordPlaceholder')} 
            icon={<Lock className="w-5 h-5" />}
            {...loginForm.register("password")}
          />
          {loginForm.formState.errors.password && (
            <p className="text-error text-sm mt-1">{loginForm.formState.errors.password.message}</p>
          )}
        </div>

        <Button type="submit" className="w-full mt-8 flex items-center justify-center gap-2" disabled={isLoading}>
          {isLoading ? <Loader2 className="animate-spin w-5 h-5" /> : (
            <>
              {t('auth.signInButton')}
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </Button>
      </form>

      <p className="mt-8 text-center font-body-sm text-body-sm text-on-surface-variant">
        {t('auth.newToSportPro')}{" "}
        <Link href={`/${locale}/register`} className="font-label-sm text-label-sm text-primary uppercase tracking-wider ml-1 hover:underline decoration-2 underline-offset-4">
          {t('auth.registerButton')}
        </Link>
      </p>
    </div>
  )
}
