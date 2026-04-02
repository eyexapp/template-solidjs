export const en = {
  common: {
    loading: 'Loading…',
    error: 'Something went wrong',
    notFound: 'Page not found',
  },
  nav: {
    home: 'Home',
  },
  home: {
    title: 'Welcome',
    description: 'Start building your next great idea.',
  },
} as const;

type DeepStringify<T> = {
  [K in keyof T]: T[K] extends Record<string, unknown> ? DeepStringify<T[K]> : string;
};

export type Locale = DeepStringify<typeof en>;
