import { createContext, useContext, useEffect, useMemo, useState } from 'react'

export const lightColors = {
  bgDark: '#F5F3EE',
  bgSurface: '#FFFFFF',
  accentMain: '#7FAF82',
  accentHover: '#9DC99F',
  accentPressed: '#5C8F60',
  accentTint: '#D8EBD9',
  textPrimary: '#172018',
  textMuted: '#6F776E',
}

export const darkColors = {
  bgDark: '#1C1E1A',
  bgSurface: '#272B23',
  accentMain: '#7FAF82',
  accentHover: '#9DC99F',
  accentPressed: '#5C8F60',
  accentTint: '#D8EBD9',
  textPrimary: '#F5F3EE',
  textMuted: '#929991',
}

const ThemeContext = createContext({
  theme: 'dark',
  colors: darkColors,
  toggleTheme: () => {},
})

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark')

  useEffect(() => {
    localStorage.setItem('theme', theme)
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  const colors = useMemo(() => (theme === 'light' ? lightColors : darkColors), [theme])

  const toggleTheme = () => {
    setTheme((current) => (current === 'light' ? 'dark' : 'light'))
  }

  return (
    <ThemeContext.Provider value={{ theme, colors, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  return useContext(ThemeContext)
}
