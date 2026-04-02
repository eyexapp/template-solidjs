import { ErrorBoundary, Suspense } from 'solid-js';
import { I18nProvider } from '~/lib/i18n';
import { ThemeProvider } from '~/stores/theme';
import AppRouter from './Router';

function ErrorFallback(err: unknown) {
  return (
    <div class="flex min-h-screen items-center justify-center">
      <div class="text-center">
        <h1 class="text-2xl font-bold text-red-600">Something went wrong</h1>
        <p class="mt-2 text-gray-600">{String(err)}</p>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary fallback={ErrorFallback}>
      <ThemeProvider>
        <I18nProvider>
          <Suspense
            fallback={
              <div class="flex min-h-screen items-center justify-center">
                <p class="text-gray-500">Loading…</p>
              </div>
            }
          >
            <AppRouter />
          </Suspense>
        </I18nProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
