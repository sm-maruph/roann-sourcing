const field = (name, label, type = 'text', extra = {}) => ({ name, label, type, ...extra });
const active = field('is_active', 'Visible', 'checkbox');
const order = field('sort_order', 'Display order', 'number', { min: 0, max: 100000 });
const image = field('image_url', 'Image URL', 'text', { maxLength: 2000 });
const name = field('name', 'Name', 'text', { required: true, maxLength: 100 });
const audiences = [['mens', 'Men’s'], ['womens', 'Women’s'], ['girls', 'Girls']];

export const resources = {
  products: {
    label: 'Products', singular: 'product',
    defaults: { sku: '', name: '', category_id: '', description: '', subtitle: '', image_url: '', color_name: '', color_hex: '#bab4a7', attributes: {}, pattern: 'plain', sort_order: 0, is_active: true },
    fields: [field('category_id', 'Category', 'product-category', { required: true }), field('sku', 'SKU', 'auto-sku'), field('name', 'Product name', 'text', { required: true, maxLength: 150 }), field('subtitle', 'Short description', 'text', { maxLength: 200 }), field('description', 'Description', 'textarea', { maxLength: 3000 }), image, field('color_name', 'Color name', 'text', { maxLength: 60 }), field('color_hex', 'Preview color', 'color'), field('pattern', 'Preview pattern', 'select', { options: ['plain', 'stripes', 'print', 'check'] }), field('attributes', 'Product attributes', 'attributes'), order, active],
  },
  categories: {
    label: 'Categories & subcategories', singular: 'category',
    defaults: { name: '', slug: '', parent_id: '', hero_image_url: '', tagline: '', description: '', config: {}, sort_order: 0, is_active: true },
    fields: [name, field('slug', 'URL name', 'text', { required: true, pattern: '[a-z0-9]+(-[a-z0-9]+)*', maxLength: 100 }), field('parent_id', 'Collection or parent category', 'parent', { required: true }), field('hero_image_url', 'Header image URL', 'text', { maxLength: 2000 }), field('tagline', 'Tagline', 'text', { maxLength: 200 }), field('description', 'Description', 'textarea', { maxLength: 1000 }), field('config.filters', 'Filter groups', 'attributes', { arrays: true }), field('config.benefits', 'Benefits (one per line, up to four)', 'lines'), field('config.banner', 'Banner heading', 'text', { maxLength: 200 }), field('config.bannerCopy', 'Banner description', 'textarea', { maxLength: 1000 }), field('config.bannerImage', 'Banner image URL'), order, active],
  },
  hero_banners: {
    label: 'Page banners', singular: 'banner',
    defaults: { sort_order: 0, page: 'home', image_url: '', title: '', accent: '', eyebrow: '', description: '', is_active: true },
    fields: [field('page', 'Page', 'select', { options: ['home', 'about', 'compliance', 'mens', 'womens', 'girls'] }), image, order, active],
  },
  partners: {
    label: 'Partners', singular: 'partner',
    defaults: { name: '', image_url: '', website_url: '', sort_order: 0, is_active: true },
    fields: [name, image, field('website_url', 'Website (HTTPS)', 'url', { maxLength: 2000 }), order, active],
  },
};

export function categoryLabel(category, categories) {
  if (!category) return 'Unassigned';
  const parent = categories.find(row => row.id === category.parent_id);
  return parent ? `${parent.name} / ${category.name}` : category.name;
}

export function getValue(object, path) { return path.split('.').reduce((value, key) => value?.[key], object); }
export function setValue(object, path, value) {
  const [first, ...rest] = path.split('.');
  return { ...object, [first]: rest.length ? setValue(object[first] || {}, rest.join('.'), value) : value };
}

export function resourcePayload(resource, row) {
  return Object.fromEntries(Object.keys(resource.defaults).map(key => [key, row[key] === undefined ? structuredClone(resource.defaults[key]) : row[key]]));
}
