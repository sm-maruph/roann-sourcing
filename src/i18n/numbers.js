const digits = '〇一二三四五六七八九';

function japaneseInteger(value) {
  if (value === 0) return digits[0];
  if (value < 0) return `−${japaneseInteger(-value)}`;
  for (const [unit, label] of [[100000000, '億'], [10000, '万']]) {
    if (value >= unit) return japaneseInteger(Math.floor(value / unit)) + label + (value % unit ? japaneseInteger(value % unit) : '');
  }
  let result = '';
  for (const [unit, label] of [[1000, '千'], [100, '百'], [10, '十']]) {
    const count = Math.floor(value / unit);
    if (count) result += (count > 1 ? digits[count] : '') + label;
    value %= unit;
  }
  return result + (value ? digits[value] : '');
}

export function formatNumber(value, locale, { minimumIntegerDigits = 1, plus = false } = {}) {
  const formatted = locale === 'ja' && Number.isSafeInteger(value)
    ? japaneseInteger(value)
    : new Intl.NumberFormat(locale, { minimumIntegerDigits }).format(value);
  return formatted + (plus ? locale === 'ja' ? '以上' : '+' : '');
}
