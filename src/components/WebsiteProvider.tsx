'use client'

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { createFoodamigosSdk } from '../index'
import type { FoodamigosSdk, FoodamigosSdkConfig } from '../index'
import type { Website } from '../modules/website'

type WebsiteContextValue = {
  website: Website | null
  sdk: FoodamigosSdk
  isLoading: boolean
  error: Error | null
}

const WebsiteContext = createContext<WebsiteContextValue | null>(null)

interface WebsiteProviderProps {
  sdkConfig: FoodamigosSdkConfig
  initialWebsite?: Website | null
  children: ReactNode
}

export function WebsiteProvider({ sdkConfig, initialWebsite, children }: WebsiteProviderProps) {
  const sdk = createFoodamigosSdk(sdkConfig)
  const [website, setWebsite] = useState<Website | null>(initialWebsite ?? null)
  const [isLoading, setIsLoading] = useState(initialWebsite == null)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (initialWebsite != null) return
    sdk.website.get()
      .then((data) => {
        setWebsite(data)
        setIsLoading(false)
      })
      .catch((err) => {
        setError(err instanceof Error ? err : new Error(String(err)))
        setIsLoading(false)
      })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <WebsiteContext.Provider value={{ website, sdk, isLoading, error }}>
      {children}
    </WebsiteContext.Provider>
  )
}

export function useWebsite(): WebsiteContextValue {
  const ctx = useContext(WebsiteContext)
  if (!ctx) throw new Error('useWebsite must be used inside WebsiteProvider')
  return ctx
}
