---
name: architecture
type: knowledge
version: 1.0.0
agent: CodeActAgent
triggers:
  - architecture
  - solidjs
  - signals
  - routing
  - components
---

# Architecture — SolidJS (Fine-Grained Reactivity)

## Project Structure

```
src/
├── index.tsx                  ← render(<App />) entry
├── App.tsx                    ← Router + layout
├── routes/
│   ├── index.tsx              ← Home page
│   ├── users.tsx              ← Users page
│   └── users/[id].tsx         ← User detail (dynamic)
├── components/
│   ├── ui/                    ← Reusable primitives
│   │   ├── Button.tsx
│   │   └── Input.tsx
│   └── users/
│       ├── UserList.tsx
│       └── UserCard.tsx
├── stores/
│   └── userStore.ts           ← createStore / Context
├── services/
│   └── api.ts                 ← Fetch wrapper
├── lib/
│   └── utils.ts
└── types/
    └── index.ts
```

## Component Pattern

```tsx
import { Component, createSignal, Show, For } from "solid-js";

const UserList: Component = () => {
  const [users] = createResource(fetchUsers);

  return (
    <Show when={!users.loading} fallback={<Spinner />}>
      <For each={users()}>
        {(user) => <UserCard user={user} />}
      </For>
    </Show>
  );
};
```

## Fine-Grained Reactivity (No VDOM)

```tsx
// Signals — reactive primitives (NOT state that re-renders components)
const [count, setCount] = createSignal(0);

// Derived — automatically tracks dependencies
const doubled = () => count() * 2; // Just a function, no memo needed

// Effects — run when dependencies change
createEffect(() => {
  console.log("Count changed:", count());
});
```

## Stores (Complex State)

```typescript
import { createStore } from "solid-js/store";

const [state, setState] = createStore({
  users: [] as User[],
  loading: false,
  filter: "",
});

// Nested updates — fine-grained
setState("users", 0, "name", "Alice");
setState("loading", true);
```

## Routing (@solidjs/router)

```tsx
import { Router, Route } from "@solidjs/router";

const App = () => (
  <Router>
    <Route path="/" component={Home} />
    <Route path="/users" component={Users} />
    <Route path="/users/:id" component={UserDetail} />
  </Router>
);
```

## createResource (Async Data)

```tsx
const [user] = createResource(
  () => params.id,  // Source signal
  async (id) => {   // Fetcher
    const res = await fetch(`/api/users/${id}`);
    return res.json();
  }
);

// user() — data, user.loading, user.error
```

## Rules

- No VDOM — SolidJS compiles to direct DOM updates.
- Components run ONCE (not on every render like React).
- Access signals with `()` — `count()` not `count`.
- `<Show>` for conditionals, `<For>` for lists (not ternary/map).
- `createResource` for async data fetching.
