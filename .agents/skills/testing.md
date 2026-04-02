---
name: testing
type: knowledge
version: 1.0.0
agent: CodeActAgent
triggers:
  - test
  - vitest
  - solid testing library
  - component test
---

# Testing — SolidJS (Vitest + Solid Testing Library)

## Component Tests

```tsx
import { render, screen } from "@solidjs/testing-library";
import { describe, it, expect } from "vitest";
import userEvent from "@testing-library/user-event";
import { Counter } from "../src/components/Counter";

describe("Counter", () => {
  it("should increment on click", async () => {
    render(() => <Counter />);
    const button = screen.getByRole("button");

    expect(screen.getByText("Count: 0")).toBeInTheDocument();
    await userEvent.click(button);
    expect(screen.getByText("Count: 1")).toBeInTheDocument();
  });
});
```

## Signal Tests

```typescript
import { describe, it, expect } from "vitest";
import { createRoot, createSignal, createEffect } from "solid-js";

describe("user store", () => {
  it("should update signal", () => {
    createRoot((dispose) => {
      const [count, setCount] = createSignal(0);
      expect(count()).toBe(0);
      setCount(5);
      expect(count()).toBe(5);
      dispose();
    });
  });
});
```

## Async Component Tests (createResource)

```tsx
import { render, screen, waitFor } from "@solidjs/testing-library";

describe("UserList", () => {
  it("should render users after loading", async () => {
    // Mock fetch
    globalThis.fetch = vi.fn().mockResolvedValue({
      json: () => Promise.resolve([{ id: "1", name: "Alice" }]),
    });

    render(() => <UserList />);

    await waitFor(() => {
      expect(screen.getByText("Alice")).toBeInTheDocument();
    });
  });
});
```

## Vitest Config

```typescript
// vitest.config.ts
import { defineConfig } from "vitest/config";
import solid from "vite-plugin-solid";

export default defineConfig({
  plugins: [solid()],
  test: {
    environment: "jsdom",
    setupFiles: ["./src/test-setup.ts"],
    globals: true,
  },
});
```

## Rules

- `@solidjs/testing-library` with `render(() => <Component />)` — arrow wrapper required.
- `createRoot` for testing reactive primitives outside components.
- `waitFor` for async resource-based components.
- Query priority: `getByRole` > `getByText` > `getByTestId`.
