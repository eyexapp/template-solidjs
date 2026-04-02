import { createContext, createEffect, createSignal, on, useContext } from 'solid-js';
import type { ParentProps } from 'solid-js';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextValue {
  theme: () => Theme;
  setTheme: (t: Theme) => void;
  isDark: () => boolean;
}

const ThemeContext = createContext<ThemeContextValue>();

function getSystemDark(): boolean {
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

export function ThemeProvider(props: ParentProps) {
  const stored = localStorage.getItem('theme') as Theme | null;
  const [theme, setTheme] = createSignal<Theme>(stored ?? 'system');

  const isDark = () => {
    const t = theme();
    return t === 'dark' || (t === 'system' && getSystemDark());
  };

  createEffect(
    on(theme, (t) => {
      localStorage.setItem('theme', t);
    }),
  );

  createEffect(() => {
    document.documentElement.classList.toggle('dark', isDark());
  });

  return (
    <ThemeContext.Provider value={{ theme, setTheme, isDark }}>
      {props.children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within a ThemeProvider');
  return ctx;
}
