"use client"

import { useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslation } from './useTranslation'

export function useAuth() {
  const { t } = useTranslation()
  const [isLoading, setIsLoading] = useState(false)

  const loginSchema = z.object({
    email: z.string().min(1, { message: t('auth.emailRequired') }).email({ message: t('auth.emailInvalid') }),
    password: z.string().min(1, { message: t('auth.passwordRequired') }),
  })

  const registerSchema = z.object({
    name: z.string().min(1, { message: "Name is required" }),
    email: z.string().min(1, { message: t('auth.emailRequired') }).email({ message: t('auth.emailInvalid') }),
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

  const registerForm = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
  })

  const onLogin = async (values: z.infer<typeof loginSchema>) => {
    setIsLoading(true)
    // Mock API call
    setTimeout(() => {
      console.log('Login success', values)
      setIsLoading(false)
    }, 1500)
  }

  const onRegister = async (values: z.infer<typeof registerSchema>) => {
    setIsLoading(true)
    // Mock API call
    setTimeout(() => {
      console.log('Register success', values)
      setIsLoading(false)
    }, 1500)
  }

  return {
    loginForm,
    registerForm,
    onLogin,
    onRegister,
    isLoading
  }
}
