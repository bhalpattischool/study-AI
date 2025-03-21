
import { englishTranslations } from './en';
import { hindiTranslations } from './hi';
import { TranslationsRecord } from '../types/translation-types';

export const translations: TranslationsRecord = {
  en: englishTranslations,
  hi: hindiTranslations
};

export * from '../types/translation-types';
