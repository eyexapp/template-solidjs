export const config = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  appTitle: import.meta.env.VITE_APP_TITLE || 'SolidJS App',
} as const;
