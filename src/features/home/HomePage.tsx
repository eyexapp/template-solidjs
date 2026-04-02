import { useI18n } from '~/lib/i18n';

export default function HomePage() {
  const { t } = useI18n();

  return (
    <div class="py-12 text-center">
      <h1 class="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
        {t('home.title')}
      </h1>
      <p class="mt-4 text-lg text-gray-600 dark:text-gray-400">{t('home.description')}</p>
    </div>
  );
}
