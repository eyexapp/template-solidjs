---
name: security-performance
type: knowledge
version: 1.0.0
agent: CodeActAgent
triggers:
  - security
  - performance
  - bundle
  - lazy
  - optimization
---

# Security & Performance — SolidJS

## Performance

### Fine-Grained Updates (Built-in)

SolidJS updates only the exact DOM nodes where signals change — no diffing, no VDOM.

```tsx
// This div only updates the text node, not the whole component
<div>Count: {count()}</div>
```

### Lazy Loading Routes

```tsx
import { lazy } from "solid-js";

const Users = lazy(() => import("./routes/users"));
const UserDetail = lazy(() => import("./routes/users/[id]"));

// Routes use lazy components for code splitting
<Route path="/users" component={Users} />
```

### Memoization (Only When Needed)

```tsx
// createMemo — only for expensive computations
const filtered = createMemo(() =>
  users().filter(u => u.name.includes(search()))
);

// Simple derivations don't need memo
const doubled = () => count() * 2; // Just a function
```

### Batch Updates

```tsx
import { batch } from "solid-js";

batch(() => {
  setCount(count() + 1);
  setName("Alice");
  setLoading(false);
}); // Single DOM update
```

### Virtualization for Large Lists

```tsx
import { VirtualList } from "@solid-primitives/virtual";

<VirtualList each={largeList()} itemSize={40}>
  {(item) => <Row item={item} />}
</VirtualList>
```

## Security

### XSS Prevention

```tsx
// SolidJS auto-escapes text content (safe)
<div>{userInput()}</div>

// ⚠️ Dangerous: innerHTML
<div innerHTML={content} />  // Only use with sanitized HTML
```

### API Security

```typescript
// Always validate API responses
import { z } from "zod";

const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
});

const fetchUsers = async () => {
  const res = await fetch("/api/users");
  const data = await res.json();
  return z.array(UserSchema).parse(data);
};
```

### Environment Variables

```bash
# Only VITE_ prefixed vars are exposed to client
VITE_API_URL=https://api.example.com
# SECRET_KEY is NOT exposed (server-only)
```

### CSP Headers

```
Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'
```
