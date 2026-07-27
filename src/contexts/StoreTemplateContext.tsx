'use client'

import { createContext, useContext, type ReactNode } from 'react'
import type { StoreTemplateId } from '@/types/store'

const StoreTemplateContext = createContext<StoreTemplateId>('classic')

export function StoreTemplateProvider({
  template,
  children,
}: {
  template: StoreTemplateId
  children: ReactNode
}) {
  return (
    <StoreTemplateContext.Provider value={template}>{children}</StoreTemplateContext.Provider>
  )
}

export function useStoreTemplate(): StoreTemplateId {
  return useContext(StoreTemplateContext)
}
