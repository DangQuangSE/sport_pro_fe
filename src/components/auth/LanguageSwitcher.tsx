"use client"

import { usePathname, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { useTranslation } from "@/hooks/useTranslation"

export function LanguageSwitcher() {
  const { locale } = useTranslation()
  const pathname = usePathname()
  const router = useRouter()

  const switchLanguage = (newLocale: string) => {
    if (newLocale === locale) return
    const newPath = pathname.replace(`/${locale}`, `/${newLocale}`)
    router.push(newPath)
  }

  return (
    <div className="absolute top-8 right-8 z-50 flex items-center gap-1 bg-surface-container-low p-1 rounded-full border border-outline-variant shadow-sm">
      {['en', 'vi'].map((lang) => (
        <button
          key={lang}
          onClick={() => switchLanguage(lang)}
          className={`relative px-4 py-1.5 rounded-full font-label-md uppercase tracking-wider transition-colors z-10 ${
            locale === lang ? "text-on-primary" : "text-on-surface-variant hover:text-on-surface"
          }`}
        >
          {locale === lang && (
            <motion.div
              layoutId="active-lang"
              className="absolute inset-0 bg-primary rounded-full -z-10 shadow-[0_2px_8px_rgba(0,88,188,0.3)]"
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            />
          )}
          {lang}
        </button>
      ))}
    </div>
  )
}
