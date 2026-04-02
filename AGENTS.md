# AGENTS.md — SolidJS Fine-Grained Reactive SPA

## Project Identity

| Key | Value |
|-----|-------|
| Framework | SolidJS 1.x (fine-grained reactivity, NO virtual DOM) |
| Language | TypeScript 5 (strict mode) |
| Category | Frontend SPA |
| State Management | Signals + Context-based stores |
| Routing | @solidjs/router |
| Styling | Tailwind CSS v4 (CSS-based config) |
| i18n | Type-safe `.ts` locale files |
| Testing | Vitest + @solidjs/testing-library |
| Linting | ESLint + Prettier |

---

## Architecture — Signal-Driven, No VDOM

```
src/
├── app.tsx                 ← Root component + Router
├── index.tsx               ← Entry point (render)
├── components/             ← PRESENTATION: Reusable UI
│   ├── ui/                 ← Atoms: Button, Input, Card
│   ├── layout/             ← Header, Footer, Sidebar
│   └── features/           ← Feature-specific components
├── pages/                  ← ROUTES: Top-level page components
│   ├── home.tsx
│   ├── products.tsx
│   └── not-found.tsx
├── stores/                 ← STATE: Context-based stores
│   ├── auth.store.tsx      ← createContext + provider
│   └── theme.store.tsx
├── services/               ← DATA: API communication
│   └── api/
│       └── client.ts
├── hooks/                  ← Custom primitives (createXxx)
├── models/                 ← TypeScript interfaces
├── i18n/                   ← Type-safe locale .ts files
│   ├── index.ts
│   └── locales/
│       ├── en.ts
│       └── tr.ts
├── types/                  ← Shared types
└── lib/                    ← Utilities, constants
```

### Strict Layer Rules

| Layer | Can Import From | NEVER Imports |
|-------|----------------|---------------|
| `pages/` | components/, stores/, services/, hooks/ | Other pages/ |
| `components/` | stores/, hooks/, types/, lib/ | pages/, services/ |
| `stores/` | services/, types/ | components/, pages/ |
| `services/` | models/, types/, lib/ | stores/, components/ |
| `hooks/` | stores/, services/, types/ | pages/, components/ |

---

## ⚠ CRITICAL — SolidJS Reactivity Model

**SolidJS components execute ONCE. They are NOT re-called on state change.**
Reactivity is tracked at the signal-access level, not the component level.

### The Rules

```tsx
// ✅ Signals are GETTER FUNCTIONS — call them to read
const [count, setCount] = createSignal(0);
<span>{count()}</span>       // ✅ Reactive — tracked
// ❌ <span>{count}</span>    // BROKEN — returns the getter, not the value

// ✅ NEVER destructure props — kills reactivity
function Card(props) {
  return <div>{props.title}</div>;  // ✅ Reactive
}
// ❌ function Card({ title }) { ... }  // BROKEN — read once, never updates

// ✅ Use mergeProps for defaults
function Button(props) {
  const merged = mergeProps({ variant: 'primary' }, props);
  return <button class={merged.variant}>{merged.children}</button>;
}

// ✅ Use splitProps to separate consumed vs forwarded props
function Input(props) {
  const [local, rest] = splitProps(props, ['label']);
  return (
    <label>
      {local.label}
      <input {...rest} />
    </label>
  );
}
```

---

## Control Flow — Built-in Components (NOT JS expressions)

```tsx
// ✅ Conditional rendering
import { Show } from 'solid-js';
<Show when={user()} fallback={<LoginForm />}>
  {(u) => <Dashboard user={u()} />}
</Show>

// ❌ NEVER use ternary for conditional rendering
// ❌ {user() ? <Dashboard /> : <LoginForm />}  // Works but loses fine-grained tracking

// ✅ List rendering
import { For } from 'solid-js';
<For each={products()}>
  {(product, index) => <ProductCard product={product} index={index()} />}
</For>

// ❌ NEVER use .map() for lists
// ❌ {products().map(p => ...)}  // Recreates all DOM nodes on any change

// ✅ Dynamic conditional (multiple branches)
import { Switch, Match } from 'solid-js';
<Switch>
  <Match when={status() === 'loading'}><Spinner /></Match>
  <Match when={status() === 'error'}><ErrorView /></Match>
  <Match when={status() === 'ready'}><Content /></Match>
</Switch>
```

---

## Adding New Code — Where Things Go

### New Feature
1. **Model**: `src/models/product.model.ts`
2. **Service**: `src/services/api/product.service.ts`
3. **Store**: `src/stores/product.store.tsx`
4. **Components**: `src/components/features/products/`
5. **Page**: `src/pages/products.tsx`
6. **Route**: Add to router in `src/app.tsx`
7. **Tests**: `src/__tests__/`

### New Context Store
```tsx
// src/stores/product.store.tsx
import { createContext, useContext, ParentComponent } from 'solid-js';
import { createStore } from 'solid-js/store';

interface ProductState {
  items: Product[];
  loading: boolean;
}

const ProductContext = createContext<ReturnType<typeof createProductStore>>();

function createProductStore() {
  const [state, setState] = createStore<ProductState>({
    items: [],
    loading: false,
  });

  return {
    state,
    async loadProducts() {
      setState('loading', true);
      const items = await fetchProducts();
      setState({ items, loading: false });
    },
  } as const;
}

export const ProductProvider: ParentComponent = (props) => (
  <ProductContext.Provider value={createProductStore()}>
    {props.children}
  </ProductContext.Provider>
);

export function useProducts() {
  const ctx = useContext(ProductContext);
  if (!ctx) throw new Error('useProducts must be used within ProductProvider');
  return ctx;
}
```

### Async Data — createResource + Suspense
```tsx
// ✅ Async data loading
import { createResource, Suspense } from 'solid-js';

function Products() {
  const [products] = createResource(fetchProducts);

  return (
    <Suspense fallback={<Spinner />}>
      <For each={products()}>
        {(p) => <ProductCard product={p} />}
      </For>
    </Suspense>
  );
}
```

---

## Design & Architecture Principles

### Fine-Grained Reactivity
- Signals update only the exact DOM node that reads them — no component re-execution
- Use `createSignal` for primitives, `createStore` for nested objects
- `createEffect` tracks dependencies automatically — no dependency arrays
- `createMemo` for expensive derivations (cached computed)

### Stores for Nested State
```typescript
const [state, setState] = createStore({ user: { name: 'Ali', age: 25 } });

// ✅ Path-based updates — fine-grained
setState('user', 'name', 'Ahmet');

// ❌ NEVER spread-copy nested state
// setState({ user: { ...state.user, name: 'Ahmet' } });
```

### YAGNI + Minimal Abstractions
- No virtual DOM overhead — don't add React patterns (useMemo, useCallback unnecessary)
- No dependency arrays — `createEffect` tracks automatically
- No `key` prop on `<For>` — SolidJS tracks by reference

---

## Error Handling

### ErrorBoundary
```tsx
import { ErrorBoundary } from 'solid-js';

<ErrorBoundary fallback={(err, reset) => (
  <div>
    <p>Error: {err.message}</p>
    <button onClick={reset}>Retry</button>
  </div>
)}>
  <App />
</ErrorBoundary>
```

### Resource Errors
```tsx
const [data, { refetch }] = createResource(fetchData);

<Show when={data.error}>
  <ErrorMessage error={data.error} onRetry={refetch} />
</Show>
```

---

## Code Quality

### Naming Conventions
| Artifact | Convention | Example |
|----------|-----------|---------|
| Component | PascalCase `.tsx` | `ProductCard.tsx` |
| Page | camelCase `.tsx` | `products.tsx` |
| Store | `*.store.tsx` | `auth.store.tsx` |
| Model | `*.model.ts` | `product.model.ts` |
| Hook/Primitive | `create*.ts` | `createMediaQuery.ts` |
| Service | `*.service.ts` | `product.service.ts` |
| i18n locale | `<lang>.ts` | `en.ts`, `tr.ts` |

### Path Alias
```typescript
// ✅ Use ~ alias (SolidJS convention)
import { Button } from '~/components/ui/Button';

// ❌ NEVER use relative imports from deep paths
import { Button } from '../../../components/ui/Button';
```

### Tailwind CSS v4 (CSS-based config)
```css
/* src/app.css — Tailwind v4 config via CSS */
@import 'tailwindcss';

@theme {
  --color-primary: #3b82f6;
  --color-background: #0a0a0a;
}
```

---

## Testing Strategy

| Level | What | Where | Tool |
|-------|------|-------|------|
| Unit | Signals, stores, utils, services | `src/__tests__/` | Vitest |
| Component | Render + reactivity | `src/__tests__/` | Vitest + @solidjs/testing-library |
| E2E | User flows | `e2e/` | Playwright |

### What MUST Be Tested
- Signal stores: state transitions, derived computations
- Components: rendering with signals, control flow (Show/For)
- createResource: loading/success/error states
- Context providers: provide + consume pattern
- i18n: locale switching, missing key fallback

---

## Security & Performance

### Performance (SolidJS Native)
- Fine-grained updates = no unnecessary re-renders (built-in)
- `<For>` keyed by reference — minimal DOM mutations
- `createMemo` for expensive computations (auto-cached)
- Lazy-load routes: `lazy(() => import('./pages/products'))`
- Suspense for async waterfall prevention

### Security
- Never use `innerHTML` — use `textContent` or SolidJS JSX
- Validate all API response shapes
- Environment variables: `VITE_` prefix for client-exposed
- Sanitize user-generated content before rendering

---

## Commands

| Action | Command |
|--------|---------|
| Dev server | `npm run dev` |
| Build | `npm run build` |
| Preview | `npm run preview` |
| Test | `npm test` |
| Lint | `npm run lint` |
| Format | `npm run format` |

---

## Prohibitions — NEVER Do These

1. **NEVER** destructure props — kills reactivity (`props.title`, not `{ title }`)
2. **NEVER** use `.map()` for lists — use `<For>` component
3. **NEVER** use ternary for conditionals — use `<Show>` / `<Switch>`
4. **NEVER** use `useMemo` / `useCallback` — these are React patterns, not SolidJS
5. **NEVER** use dependency arrays — `createEffect` tracks automatically
6. **NEVER** spread-copy nested store state — use path-based `setState`
7. **NEVER** use `@/` alias — SolidJS template uses `~/`
8. **NEVER** add `key` prop on `<For>` — tracking is by reference
9. **NEVER** use `any` type — strict TypeScript
10. **NEVER** treat components as re-callable — they execute ONCE, signals drive updates
