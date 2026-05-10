"use client"

import { useParams } from 'next/navigation'
import { useState, useEffect } from 'react'

export function useTranslation() {
  const params = useParams()
  const locale = (params.lang as 'en' | 'vi') || 'en'
  const [dict, setDict] = useState<Record<string, unknown> | null>(null)

  useEffect(() => {
    import(`@/dictionaries/${locale}.json`).then((module) => {
      setDict(module.default)
    })
  }, [locale])

  const t = (key: string) => {
    if (!dict) return ''
    const keys = key.split('.')
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let val: any = dict
    for (const k of keys) {
      if (val[k] === undefined) return key
      val = val[k]
    }
    return val
  }

  return { t, locale }
}
