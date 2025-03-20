
import { ThemeProvider } from "./providers/ThemeProvider"
import { LanguageProvider } from './contexts/LanguageContext';

interface ThemeWrapperProps {
  children: React.ReactNode
}

export function ThemeWrapper({ children }: ThemeWrapperProps) {
  return (
    <ThemeProvider>
      <LanguageProvider>
        {children}
      </LanguageProvider>
    </ThemeProvider>
  );
}
