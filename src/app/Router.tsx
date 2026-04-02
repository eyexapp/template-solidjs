import { lazy } from 'solid-js';
import { Route, Router } from '@solidjs/router';
import MainLayout from '~/layouts/MainLayout';

const HomePage = lazy(() => import('~/features/home/HomePage'));

function NotFoundPage() {
  return (
    <div class="flex min-h-[50vh] flex-col items-center justify-center">
      <h1 class="text-4xl font-bold">404</h1>
      <p class="mt-2 text-gray-500 dark:text-gray-400">Page not found</p>
    </div>
  );
}

export default function AppRouter() {
  return (
    <Router root={MainLayout}>
      <Route path="/" component={HomePage} />
      <Route path="*404" component={NotFoundPage} />
    </Router>
  );
}
