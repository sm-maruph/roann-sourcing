import { jsx as reactJsx, jsxs as reactJsxs, Fragment } from 'react/jsx-runtime';
import LocalizedElement from './LocalizedElement';
export { Fragment };
export function jsx(type, props, key) {
  return typeof type === 'string' ? reactJsx(LocalizedElement, { ...props, element: type }, key) : reactJsx(type, props, key);
}
export function jsxs(type, props, key) {
  return typeof type === 'string' ? reactJsxs(LocalizedElement, { ...props, element: type }, key) : reactJsxs(type, props, key);
}
