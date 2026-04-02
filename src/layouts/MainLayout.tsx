import { A } from '@solidjs/router';
import type { RouteSectionProps } from '@solidjs/router';
import { For } from 'solid-js';
import { useI18n } from '~/lib/i18n';
import type { SupportedLocale } from '~/lib/i18n';
import { useTheme } from '~/stores/theme';

const locales: { code: SupportedLocale; label: string }[] = [
  { code: 'en', label: 'EN' },
  { code: 'tr', label: 'TR' },
];

export default function MainLayout(props: RouteSectionProps) {
  const { t, locale, setLocale } = useI18n();
  const { setTheme, isDark } = useTheme();

  return (
    <div class="min-h-screen bg-white text-gray-900 dark:bg-gray-950 dark:text-gray-100">
      <nav class="border-b border-gray-200 dark:border-gray-800">
        <div class="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <A href="/" class="text-primary-600 dark:text-primary-400 text-lg font-semibold">
            {t('nav.home')}
          </A>

          <div class="flex items-center gap-3">
            {/* Language switcher */}
            <div class="flex gap-1">
              <For each={locales}>
                {(loc) => (
                  <button
                    class="rounded px-2 py-1 text-xs font-medium transition-colors"
                    classList={{
                      'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300':
                        locale() === loc.code,
                      'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200':
                        locale() !== loc.code,
                    }}
                    onClick={() => setLocale(loc.code)}
                  >
                    {loc.label}
                  </button>
                )}
              </For>
            </div>

            {/* Theme toggle */}
            <button
              class="rounded-md p-1.5 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200"
              onClick={() => setTheme(isDark() ? 'light' : 'dark')}
              aria-label={`Switch to ${isDark() ? 'light' : 'dark'} theme`}
            >
              {isDark() ? '☀️' : '🌙'}
            </button>
          </div>
        </div>
      </nav>

      <main class="mx-auto max-w-5xl px-4 py-8">{props.children}</main>
    </div>
  );
}
