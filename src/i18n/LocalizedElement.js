import { createElement } from 'react';
import { translate, useLanguage } from './language';
import { formatNumber } from './numbers';

function translateChildren(children, locale) {
  if (typeof children === 'number') return formatNumber(children, locale);
  if (typeof children === 'string') return translate(children, locale);
  if (Array.isArray(children)) return children.map(child => translateChildren(child, locale));
  return children;
}

// Translate at React's rendering boundary, leaving data, filter values, URLs,
// event handlers and user-entered form values in their original form.
export default function LocalizedElement({ element, ...props }) {
  const locale = useLanguage();
  if (props.translate === 'no' || ['script', 'style', 'code'].includes(element)) return createElement(element, props);
  const localized = { ...props, children: translateChildren(props.children, locale) };
  for (const attribute of ['alt', 'title', 'placeholder', 'aria-label', 'aria-description']) {
    if (typeof props[attribute] === 'string') localized[attribute] = translate(props[attribute], locale);
  }
  return createElement(element, localized);
}
