import { useSyncExternalStore } from 'react';
import es from './es.json';
import ja from './ja.json';
import de from './de.json';
import { formatNumber } from './numbers';

export const languages = [['en', 'English'], ['es', 'Español'], ['ja', '日本語'], ['de', 'Deutsch']];
const catalogs = { es, ja, de };
const listeners = new Set();
let language = 'en';
try {
  const saved = localStorage.getItem('roann-language');
  if (languages.some(([code]) => code === saved)) language = saved;
} catch { /* Private browsing can disable storage. */ }

function subscribe(listener) { listeners.add(listener); return () => listeners.delete(listener); }
export function useLanguage() { return useSyncExternalStore(subscribe, () => language, () => 'en'); }
export function setLanguage(value) {
  if (!languages.some(([code]) => code === value)) return;
  language = value;
  document.documentElement.lang = value;
  try { localStorage.setItem('roann-language', value); } catch { /* Keep the in-memory selection. */ }
  listeners.forEach(listener => listener());
}

const protectedText = new Set(['ROANN SOURCING', 'Roann Sourcing', 'ROANN', 'PRIMARK', 'salling', 'group', 'K', 'mart', 'Nutmeg', 'MATALAN', 'TALLY', 'next', 'H&M', 'BSCI', 'OEKO-TEX®', 'Sedex', 'ISO', 'SGS', 'Nazim Akter', 'NA']);
const normalize = text => text.replace(/\s+/g, ' ').trim();
const escape = text => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
// Longer phrases win, allowing composed labels and product names to share translations.
const phrases = Object.keys(es).filter(text => !protectedText.has(text) && /[A-Za-z]/.test(text)).sort((a, b) => b.length - a.length);
const phrasePattern = new RegExp(`(?<![A-Za-z0-9])(?:${phrases.map(escape).join('|')})(?![A-Za-z0-9])`, 'g');

export function translate(value, locale = language) {
  if (typeof value !== 'string' || locale === 'en' || !value.trim()) return value;
  const catalog = catalogs[locale];
  const text = normalize(value);
  if (protectedText.has(text) || /^(?:RS-|https?:|mailto:|\+?\d[\d\s()-]*$)/.test(text) || text.includes('@')) return value;
  let translated = catalog[text] || text.replace(phrasePattern, match => catalog[match] || match);
  if (locale === 'ja') {
    translated = translated.replace(/(?<![A-Za-z0-9])\d+(?![A-Za-z0-9])/g, number => formatNumber(Number(number), locale));
  }
  return `${value.match(/^\s*/)[0]}${translated}${value.match(/\s*$/)[0]}`;
}

// Pages set their own titles; keep those titles synchronized with the selection.
export function initializeDocumentLanguage() {
  document.documentElement.lang = language;
  let sourceTitle = document.title;
  const description = document.querySelector('meta[name="description"]');
  const sourceDescription = description?.content;
  let translatedTitle = '';
  const update = () => {
    if (document.title !== translatedTitle) sourceTitle = document.title;
    translatedTitle = translate(sourceTitle);
    if (document.title !== translatedTitle) document.title = translatedTitle;
    if (description) description.content = translate(sourceDescription);
  };
  const observer = new MutationObserver(update);
  observer.observe(document.querySelector('title'), { childList: true, characterData: true, subtree: true });
  listeners.add(update);
  update();
}
