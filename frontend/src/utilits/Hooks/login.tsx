/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useContext, type ReactNode } from "react" // 1. Added useContext

interface TermsContextType {
  showTerms: boolean
  setShowTerms: (val: boolean) => void
}

type Props = {
  children: ReactNode
}

const TermsContext = createContext<TermsContextType | undefined>(undefined)

export const TermsProvider = ({ children }: Props) => {
  const [showTerms, setShowTerms] = useState(false)

  return (
    <TermsContext.Provider value={{ showTerms, setShowTerms }}>
      {children}
    </TermsContext.Provider>
  )
}

export const useTerms = (): TermsContextType => {
  // 2. Added return type
  const context = useContext(TermsContext)

  if (!context) {
    throw new Error("useTerms must be used within a TermsProvider")
  }

  return context // 3. MUST return the context
}
