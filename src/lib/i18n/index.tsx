import { flatten, translator } from '@solid-primitives/i18n';
import type { Translator, Flatten } from '@solid-primitives/i18n';
import { createContext, createSignal, useContext } from 'solid-js';
import type { ParentProps } from 'solid-js';
import { en } from './locales/en';
import type { Locale } from './locales/en';

export type SupportedLocale = 'en' | 'tr';

type FlatDict = Flatten<Locale>;

interface I18nContextValue {
  t: Translator<FlatDict>;
  locale: () => SupportedLocale;
  setLocale: (lang: SupportedLocale) => void;
}

const I18nContext = createContext<I18nContextValue>();

const dictionaries: Record<SupportedLocale, () => Promise<Locale>> = {
  en: () => Promise.resolve(en),
  tr: () => import('./locales/tr').then((m) => m.tr),
};

export function I18nProvider(props: ParentProps) {
  const [locale, setLocale] = createSignal<SupportedLocale>('en');
  const [dict, setDict] = createSignal<FlatDict>(flatten(en));

  // eslint-disable-next-line solid/reactivity -- translator() creates its own reactive tracking
  const t = translator(dict);

  const changeLocale = (lang: SupportedLocale) => {
    void dictionaries[lang]().then((d) => {
      setDict(flatten(d));
      setLocale(lang);
    });
  };

  return (
    <I18nContext.Provider value={{ t, locale, setLocale: changeLocale }}>
      {props.children}
    </I18nContext.Provider>
  );
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used within an I18nProvider');
  return ctx;
}
