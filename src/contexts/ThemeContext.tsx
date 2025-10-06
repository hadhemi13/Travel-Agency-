'use client'
import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

type Theme = 'light' | 'dark'
type Language = 'fr' | 'en'

interface ThemeContextType {
    theme: Theme
    language: Language
    setTheme: (theme: Theme) => void
    setLanguage: (language: Language) => void
    toggleTheme: () => void
    toggleLanguage: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export const useTheme = () => {
    const context = useContext(ThemeContext)
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider')
    }
    return context
}

interface ThemeProviderProps {
    children: ReactNode
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
    const [theme, setTheme] = useState<Theme>('light')
    const [language, setLanguage] = useState<Language>('fr')

    useEffect(() => {
        // Load theme from localStorage
        const savedTheme = localStorage.getItem('theme') as Theme
        if (savedTheme) {
            setTheme(savedTheme)
        } else {
            // Check system preference
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
            setTheme(prefersDark ? 'dark' : 'light')
        }

        // Load language from localStorage
        const savedLanguage = localStorage.getItem('language') as Language
        if (savedLanguage) {
            setLanguage(savedLanguage)
        }
    }, [])

    useEffect(() => {
        // Apply theme to document
        document.documentElement.classList.remove('light', 'dark')
        document.documentElement.classList.add(theme)
        localStorage.setItem('theme', theme)
    }, [theme])

    useEffect(() => {
        // Save language to localStorage
        localStorage.setItem('language', language)
    }, [language])

    const toggleTheme = () => {
        setTheme(prev => prev === 'light' ? 'dark' : 'light')
    }

    const toggleLanguage = () => {
        setLanguage(prev => prev === 'fr' ? 'en' : 'fr')
    }

    return (
        <ThemeContext.Provider value={{
            theme,
            language,
            setTheme,
            setLanguage,
            toggleTheme,
            toggleLanguage
        }}>
            {children}
        </ThemeContext.Provider>
    )
}
