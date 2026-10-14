import { useLanguage } from '../i18n/language';
import { formatNumber } from '../i18n/numbers';

export default function LocalizedNumber({ value, ...options }) {
  return formatNumber(Number(value), useLanguage(), options);
}
