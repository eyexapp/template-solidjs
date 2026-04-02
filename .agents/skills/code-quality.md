---
name: code-quality
type: knowledge
version: 1.0.0
agent: CodeActAgent
triggers:
  - code quality
  - naming
  - reactivity
  - patterns
  - typescript
---

# Code Quality — SolidJS

## Naming Conventions

| Element | Convention | Example |
|---------|-----------|---------|
| Component | PascalCase | `UserCard` |
| Signal | camelCase (get/set) | `[count, setCount]` |
| Store | camelCase | `[state, setState]` |
| Utility | camelCase | `formatDate` |
| File (component) | PascalCase.tsx | `UserCard.tsx` |
| File (utility) | camelCase.ts | `userStore.ts` |
| CSS Module | camelCase | `styles.userCard` |

## SolidJS-Specific Patterns

```tsx
// ✅ Correct: access signal inside JSX (tracked)
<div>{count()}</div>

// ❌ Wrong: destructure signal (breaks reactivity)
const { count } = props; // NEVER destructure props

// ✅ Correct: access props directly
const UserCard = (props: { name: string }) => {
  return <div>{props.name}</div>;
};

// ✅ Or use mergeProps for defaults
const UserCard = (rawProps: { name?: string }) => {
  const props = mergeProps({ name: "Unknown" }, rawProps);
  return <div>{props.name}</div>;
};
```

## Control Flow Components

```tsx
// Conditional rendering
<Show when={user()} fallback={<Loading />}>
  {(user) => <UserProfile user={user()} />}
</Show>

// List rendering (keyed by reference)
<For each={users()}>
  {(user, index) => <UserCard user={user} index={index()} />}
</For>

// Switch/Match
<Switch fallback={<NotFound />}>
  <Match when={loading()}><Spinner /></Match>
  <Match when={error()}><ErrorMessage error={error()} /></Match>
  <Match when={data()}>{(d) => <Content data={d()} />}</Match>
</Switch>
```

## Context API

```tsx
// stores/userContext.tsx
const UserContext = createContext<UserStore>();

export const UserProvider: ParentComponent = (props) => {
  const [state, setState] = createStore({ users: [], loading: false });
  const store: UserStore = { state, loadUsers: async () => { ... } };

  return <UserContext.Provider value={store}>{props.children}</UserContext.Provider>;
};

export const useUser = () => {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be inside UserProvider");
  return ctx;
};
```

## Error Boundaries

```tsx
<ErrorBoundary fallback={(err) => <div>Error: {err.message}</div>}>
  <MyComponent />
</ErrorBoundary>
```
