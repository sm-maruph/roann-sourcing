import { jsxDEV as reactJsxDEV, Fragment } from 'react/jsx-dev-runtime';
import LocalizedElement from './LocalizedElement';
export { Fragment };
export function jsxDEV(type, props, key, staticChildren, source, self) {
  return typeof type === 'string'
    ? reactJsxDEV(LocalizedElement, { ...props, element: type }, key, staticChildren, source, self)
    : reactJsxDEV(type, props, key, staticChildren, source, self);
}
