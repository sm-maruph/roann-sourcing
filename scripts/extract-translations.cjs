const fs = require('node:fs');
const path = require('node:path');
const { parse } = require('@babel/parser');
const strings = new Set();
function add(value, visible = false) {
  const text = value.replace(/\s+/g, ' ').trim();
  if (!visible && (/^[a-z][a-z\d-]*$/.test(text) || /^[MLCQHVZ\d\s.,-]+$/i.test(text))) return;
  if (/[A-Za-z]/.test(text) && !text.includes('@') && !/^[/.#&]/.test(text)) strings.add(text);
}
function visit(node) {
  if (!node || typeof node !== 'object') return;
  if (node.type === 'ImportDeclaration') return;
  if (node.type === 'JSXAttribute' && !['alt', 'title', 'placeholder', 'aria-label', 'aria-description', 'audience', 'statement'].includes(node.name.name)) return;
  if (node.type === 'ObjectProperty' && ['id', 'code', 'hero', 'image', 'src', 'color', 'pattern', 'className', 'bannerImage', 'category'].includes(node.key.name)) return;
  if (node.type === 'StringLiteral') add(node.value);
  if (node.type === 'JSXText') add(node.value, true);
  if (node.type === 'TemplateElement') add(node.value.cooked || '');
  if (node.type === 'ObjectProperty' && !node.computed && node.key.type === 'Identifier' && /^[A-Z]/.test(node.key.name)) add(node.key.name);
  for (const [key, value] of Object.entries(node)) {
    if (['loc', 'start', 'end', 'extra'].includes(key)) continue;
    if (Array.isArray(value)) value.forEach(visit);
    else if (value && typeof value === 'object') visit(value);
  }
}
function walk(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (entry.name === 'i18n') continue;
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(file);
    else if (/\.(jsx|js)$/.test(file)) visit(parse(fs.readFileSync(file, 'utf8'), { sourceType: 'module', plugins: ['jsx'] }));
  }
}
walk(path.resolve('src'));
// Dynamic phrases use the same dictionary as static content.
['in', 'styles', 'style', 'men’s', 'women’s', 'girls’', 'Fabrics', 'Colors', 'Collection', 'collection', 'apparel collection', 'apparel categories', 'product catalog', 'Explore', 'Show', 'Styles', 'Clear all (', ')', 'All Age Groups', 'All Styles', 'All Fabrics', 'All Colors', 'Filter by', 'View', 'Request quote for', 'colors', 'sourcing materials', 'Selected color:', 'apparel that brings your brand’s vision to life.', 'apparel sourcing enquiry', 'Quote request:', 'Custom', 'ROANN /', 'ROANN SOURCING. All rights reserved.', 'Roann Sourcing | Global Apparel Sourcing Partner', 'Roann Sourcing — your trusted global apparel sourcing partner. Quality manufacturing, ethical production, and long-term partnerships.'].forEach(text => add(text, true));
add('subcategories', true);
fs.mkdirSync('src/i18n', { recursive: true });
fs.writeFileSync('src/i18n/source-strings.json', JSON.stringify([...strings].sort(), null, 2));
console.log(`Extracted ${strings.size} strings`);
