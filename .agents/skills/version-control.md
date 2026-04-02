---
name: version-control
type: knowledge
version: 1.0.0
agent: CodeActAgent
triggers:
  - git
  - commit
  - ci
  - deploy
  - vite
---

# Version Control — SolidJS

## Commits

- `feat(users): add user list with createResource`
- `fix(store): prevent signal tracking loss in derived`
- `refactor(routes): switch to file-based routing`

## CI Pipeline

```bash
npm ci
npx biome check .
npx tsc --noEmit
npx vitest run
npm run build
```

## Vite Build

```bash
npm run dev          # Vite dev server
npm run build        # Production build
npm run preview      # Preview production build
```

## Docker

```dockerfile
FROM node:22-slim AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
```

## .gitignore

```
node_modules/
dist/
.env
*.local
```
