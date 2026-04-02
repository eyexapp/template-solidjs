# SolidJS Template — AI Coding Instructions

## Core Principle: Fine-Grained Reactivity

SolidJS components execute **once**. Only signals, memos, and effects react to changes.
The DOM updates surgically — no virtual DOM diffing, no re-renders.

## Critical Rules

### 1. NEVER destructure props

```tsx
// ❌ WRONG — loses reactivity
function Card({ title, children }) { ... }

// ✅ CORRECT — preserves reactivity
function Card(props: ParentProps<{ title: string }>) {
  return <h2>{props.title}</h2>;
}

// ✅ Also correct — use splitProps for separation
const [local, rest] = splitProps(props, ['title', 'class']);
```

### 2. Signals are getter functions

```tsx
// ❌ WRONG
const count = createSignal(0);
<p>{count}</p>;

// ✅ CORRECT — call the getter
const [count, setCount] = createSignal(0);
<p>{count()}</p>;
```

### 3. Use control flow components

```tsx
// ❌ WRONG — breaks reactivity tracking
{condition ? <A /> : <B />}
{items.map(item => <Card item={item} />)}

// ✅ CORRECT
<Show when={condition()} fallback={<B />}><A /></Show>
<For each={items()}>{(item) => <Card item={item} />}</For>
```

### 4. Use createResource for async data

```tsx
const [data] = createResource(
  () => params.id, // source signal
  (id) => api.get(`/items/${id}`), // fetcher
);

// Integrates with <Suspense> and <ErrorBoundary> automatically
```

## Architecture

```
Request Flow:
index.tsx → App.tsx → [Providers] → Router → MainLayout → Page Components

Provider Nesting Order:
ErrorBoundary → ThemeProvider → I18nProvider → Suspense → Router
```

### Layer Map

| Layer      | Path                 | Responsibility                       |
| ---------- | -------------------- | ------------------------------------ |
| Entry      | `src/index.tsx`      | Renders App into DOM                 |
| App        | `src/app/App.tsx`    | Provider tree, error boundary        |
| Routing    | `src/app/Router.tsx` | Route definitions, lazy loading      |
| Layouts    | `src/layouts/`       | Page shells with nav + outlet        |
| Features   | `src/features/`      | Domain-specific pages/components     |
| Components | `src/components/ui/` | Shared stateless UI primitives       |
| Stores     | `src/stores/`        | Context-based reactive state         |
| Lib        | `src/lib/`           | Utilities (API client, i18n, config) |
| Types      | `src/types/`         | Shared TypeScript definitions        |
| Tests      | `tests/`             | Vitest + @solidjs/testing-library    |

## Key Patterns

### Component with variants (mergeProps + splitProps)

```tsx
import { mergeProps, splitProps } from 'solid-js';
import type { JSX } from 'solid-js';

interface ButtonProps extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'solid' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export default function Button(rawProps: ButtonProps) {
  const props = mergeProps({ variant: 'solid', size: 'md' }, rawProps);
  const [local, rest] = splitProps(props, ['variant', 'size', 'class', 'children']);
  // Use local.variant, local.size for styling; spread ...rest onto <button>
}
```

### Store with context

```tsx
const MyContext = createContext<ContextValue>();

export function MyProvider(props: ParentProps) {
  const [state, setState] = createSignal(initialValue);
  return <MyContext.Provider value={{ state, setState }}>{props.children}</MyContext.Provider>;
}

export function useMy() {
  const ctx = useContext(MyContext);
  if (!ctx) throw new Error('useMy must be used within MyProvider');
  return ctx;
}
```

### API call with createResource

```tsx
import { createResource, Show, Suspense } from 'solid-js';
import { api } from '~/lib/api/client';

const [data, { refetch }] = createResource(fetcherFn);
```

### i18n usage

```tsx
import { useI18n } from '~/lib/i18n';
const { t, locale, setLocale } = useI18n();
<h1>{t('home.title')}</h1>;
```

## Common Tasks

### Add a new page

1. Create `src/features/<name>/<Name>Page.tsx`
2. Add lazy import + `<Route>` in `src/app/Router.tsx`
3. Optionally add nav link in `src/layouts/MainLayout.tsx`

### Add a new shared component

1. Create `src/components/ui/<Name>.tsx`
2. Use `mergeProps` for defaults, `splitProps` to separate custom/native props
3. Add test in `tests/components/<Name>.test.tsx`

### Add a new store

1. Create `src/stores/<name>.tsx` with context + provider pattern
2. Wrap in provider tree in `src/app/App.tsx`
3. Use via `use<Name>()` hook in components

### Add a new locale

1. Create `src/lib/i18n/locales/<code>.ts` implementing `Locale` type
2. Add import to `dictionaries` map in `src/lib/i18n/index.tsx`
3. Add to `SupportedLocale` union type

### Add API endpoint usage

1. Define types in feature or `src/lib/api/types.ts`
2. Use `api.get<T>()` / `api.post<T>()` from `~/lib/api/client`
3. Wrap with `createResource` in component for Suspense integration

## File Naming Conventions

- Components: `PascalCase.tsx` (e.g., `Button.tsx`, `MainLayout.tsx`)
- Utilities: `camelCase.ts` (e.g., `client.ts`, `config.ts`)
- Stores: `camelCase.tsx` (e.g., `theme.tsx`)
- Tests: `<ComponentName>.test.tsx`
- Types: `camelCase.ts`

## Dependencies

- **solid-js** — Core reactive framework
- **@solidjs/router** — Client-side routing (Route, A, Navigate, lazy)
- **@solid-primitives/i18n** — Internationalization (flatten, translator)
- **tailwindcss v4** — Utility-first CSS (`@import 'tailwindcss'` + `@theme`)
- **vitest** — Test runner (globals mode)
- **@solidjs/testing-library** — Component testing (render, screen, fireEvent)

## Important

- Path alias `~` maps to `src/` — use `~/lib/config` not `../../lib/config`
- Tailwind v4 uses CSS-based config (`src/styles/app.css`), not `tailwind.config.js`
- Theme switching uses `dark` class on `<html>` — works with Tailwind `dark:` variant
- i18n dictionaries are `.ts` files (type-safe), not JSON
- All routes are lazy-loaded via `lazy(() => import(...))`
