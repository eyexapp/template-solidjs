# SolidJS Template

Production-ready SolidJS starter with fine-grained reactivity, type-safe architecture, and modern tooling.

## Tech Stack

| Layer          | Technology                             |
| -------------- | -------------------------------------- |
| **Framework**  | SolidJS 1.9                            |
| **Routing**    | @solidjs/router 0.15                   |
| **Styling**    | Tailwind CSS 4                         |
| **Language**   | TypeScript 5.7 (strict)                |
| **Build**      | Vite 6                                 |
| **Testing**    | Vitest + @solidjs/testing-library      |
| **i18n**       | @solid-primitives/i18n                 |
| **Linting**    | ESLint 9 + eslint-plugin-solid         |
| **Formatting** | Prettier + prettier-plugin-tailwindcss |
| **Git Hooks**  | Husky + lint-staged                    |

## Quick Start

```bash
# Install dependencies
npm install

# Start dev server (http://localhost:5173)
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

## Project Structure

```
src/
├── index.tsx                  # Entry point — render + CSS import
├── env.d.ts                   # Vite env type declarations
├── app/
│   ├── App.tsx                # Root component (providers + error boundary)
│   └── Router.tsx             # Route definitions (lazy-loaded)
├── components/
│   └── ui/
│       └── Button.tsx         # Shared UI components
├── features/
│   └── home/
│       └── HomePage.tsx       # Feature-based pages
├── layouts/
│   └── MainLayout.tsx         # App shell (nav + outlet)
├── lib/
│   ├── api/
│   │   ├── client.ts          # Type-safe fetch wrapper
│   │   └── types.ts           # API types (ApiResponse, ApiError)
│   ├── i18n/
│   │   ├── index.tsx          # I18nProvider + useI18n hook
│   │   └── locales/
│   │       ├── en.ts          # English (base locale)
│   │       └── tr.ts          # Turkish
│   └── config.ts              # Type-safe env config
├── stores/
│   └── theme.tsx              # Theme context (dark/light/system)
├── styles/
│   └── app.css                # Tailwind imports + custom theme
└── types/
    └── index.ts               # Shared utility types
tests/
├── setup.ts                   # Test setup (jest-dom matchers)
└── components/
    └── Button.test.tsx        # Example component test
```

## Architecture

### Provider Tree

```
ErrorBoundary
  └── ThemeProvider
        └── I18nProvider
              └── Suspense
                    └── Router (with MainLayout as root)
                          └── Route pages
```

### Layer Responsibilities

| Layer            | Purpose                                              | Example                      |
| ---------------- | ---------------------------------------------------- | ---------------------------- |
| `app/`           | Application bootstrap, routing, provider composition | `App.tsx`, `Router.tsx`      |
| `features/`      | Feature modules — pages grouped by domain            | `features/home/HomePage.tsx` |
| `components/ui/` | Reusable, stateless UI primitives                    | `Button`, `Input`, `Modal`   |
| `layouts/`       | Page shells with navigation and outlet               | `MainLayout.tsx`             |
| `lib/`           | Core utilities: API client, i18n, config             | `lib/api/client.ts`          |
| `stores/`        | Reactive state via context + signals/stores          | `stores/theme.tsx`           |
| `types/`         | Shared TypeScript type definitions                   | `Nullable<T>`, `Dict<T>`     |

## Common Tasks

### Add a new route

```tsx
// 1. Create the page component in features/
// src/features/users/UsersPage.tsx
export default function UsersPage() {
  return <h1>Users</h1>;
}

// 2. Add lazy import and route in app/Router.tsx
const UsersPage = lazy(() => import('~/features/users/UsersPage'));

<Route path="/users" component={UsersPage} />;
```

### Add a new store

```tsx
// src/stores/auth.tsx
import { createContext, createSignal, useContext } from 'solid-js';
import type { ParentProps } from 'solid-js';

interface AuthContextValue {
  user: () => User | null;
  login: (credentials: Credentials) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue>();

export function AuthProvider(props: ParentProps) {
  const [user, setUser] = createSignal<User | null>(null);
  // ... implementation
  return (
    <AuthContext.Provider value={{ user, login, logout }}>{props.children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
```

### Fetch data with createResource

```tsx
import { createResource, Show } from 'solid-js';
import { api } from '~/lib/api/client';
import type { ApiResponse } from '~/lib/api/types';

interface User {
  id: string;
  name: string;
}

export default function UserProfile(props: { id: string }) {
  const [user] = createResource(
    () => props.id,
    (id) => api.get<ApiResponse<User>>(`/users/${id}`).then((r) => r.data),
  );

  return (
    <Show when={user()} fallback={<p>Loading…</p>}>
      {(u) => <h1>{u().name}</h1>}
    </Show>
  );
}
```

### Add an i18n key

```ts
// 1. Add the key to en.ts (base locale)
export const en = {
  // ...existing keys
  users: {
    title: 'Users',
    empty: 'No users found',
  },
} as const;

// 2. Add the translation to tr.ts
export const tr: Locale = {
  // ...existing keys
  users: {
    title: 'Kullanıcılar',
    empty: 'Kullanıcı bulunamadı',
  },
};

// 3. Use in component
const { t } = useI18n();
<h1>{t('users.title')}</h1>
```

## Scripts

| Command                 | Description                      |
| ----------------------- | -------------------------------- |
| `npm run dev`           | Start Vite dev server with HMR   |
| `npm run build`         | Type-check + production build    |
| `npm run preview`       | Preview production build locally |
| `npm test`              | Run tests once                   |
| `npm run test:watch`    | Run tests in watch mode          |
| `npm run test:coverage` | Run tests with coverage report   |
| `npm run lint`          | Run ESLint                       |
| `npm run lint:fix`      | Run ESLint with auto-fix         |
| `npm run format`        | Format all files with Prettier   |
| `npm run format:check`  | Check formatting without writing |
| `npm run typecheck`     | Run TypeScript type checking     |

## Environment Variables

| Variable            | Description       | Default                     |
| ------------------- | ----------------- | --------------------------- |
| `VITE_API_BASE_URL` | API base URL      | `http://localhost:3000/api` |
| `VITE_APP_TITLE`    | Application title | `SolidJS App`               |

Copy `.env.example` to `.env` and customize values.

## SolidJS Key Rules

- **Never destructure props** — use `props.name` or `splitProps()`/`mergeProps()`
- **Signals are getters** — call `count()` not `count` to read values
- **Components run once** — only reactive subscriptions update the DOM
- **Use control flow components** — `<Show>`, `<For>`, `<Switch>`/`<Match>` instead of ternary/`.map()`
- **Use `createResource`** for async data — integrates with `<Suspense>`
- **Use context + signals/stores** for state — not external state managers
