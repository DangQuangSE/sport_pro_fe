"use client"

import { ReactNode } from "react"
import { LanguageSwitcher } from "./LanguageSwitcher"
import { useTranslation } from "@/hooks/useTranslation"

export function AuthLayout({ children }: { children: ReactNode }) {
  const { t } = useTranslation()
  
  return (
    <div className="w-full min-h-screen flex flex-col md:flex-row bg-surface-container-low selection:bg-primary selection:text-on-primary font-body-md antialiased text-on-surface">
      <LanguageSwitcher />
      
      <div className="hidden md:flex md:w-1/2 relative bg-surface-variant overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent z-10 mix-blend-multiply"></div>
        <img 
          className="absolute inset-0 w-full h-full object-cover object-center grayscale-[0.2] contrast-125" 
          alt="Athlete exploding off starting blocks"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDDECuQLCVyZ1Nc60vM9UdJlYV5XGw6QSAfYPC2l5MVYf8ZkR4de2xz77caedbIpYS_ICDISwC2-RYTRTNuOkjzOnfO6_hGqjlYZ60yYb7eZlCyXByh1BlfgYhkGzViQOtDVC7T0zpXj3y8sRYEiXNJthBpu--7w4FW7sTy-ZxFM-QOUQ0FHikW-yqfPvMeqB9i8sem8_-LMzkpZlUlQm9LkEOZOc8G3M4l_OTOiIIU4ditAhOlBdiEKRgg2aKaup9o4oj7mCyOQq8"
        />
        <div className="absolute bottom-12 left-12 z-20 max-w-md">
          <h2 className="font-display-xl text-display-xl text-on-primary italic leading-none mb-4 shadow-sm whitespace-pre-line">
            {t('auth.heroTitle')}
          </h2>
          <p className="font-body-lg text-body-lg text-on-primary/90">
            {t('auth.heroSubtitle')}
          </p>
        </div>
      </div>
      
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 lg:p-8 bg-surface-bright min-h-screen">
        {children}
      </div>
    </div>
  )
}
