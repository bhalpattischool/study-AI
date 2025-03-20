import { ThemeProvider } from "@/components/theme-provider"
import { SessionProvider } from "next-auth/react"

import { LanguageProvider } from './contexts/LanguageContext';

interface ThemeWrapperProps {
  children: React.ReactNode
  session?: any
}

// Wrap the application with both ThemeProvider and LanguageProvider
export function ThemeWrapper({ children, session }: ThemeWrapperProps) {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <LanguageProvider>
        <SessionProvider session={session}>
          {children}
        </SessionProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
