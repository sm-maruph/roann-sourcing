export const mensCategories = [
  { id: 't-shirts', title: 'T-Shirts', label: 'T-Shirts', code: 'MTS', hero: '/images/hero.jpg', tagline: 'Everyday essentials. Global quality.', description: 'Versatile styles. Premium fabrics. Reliable manufacturing for global brands.', tabs: ['All', 'Crew Neck', 'V-Neck', 'Polo Shirt', 'Long Sleeve', 'Oversized'], filters: { 'Product Type': ['Crew Neck', 'V-Neck', 'Polo Shirt', 'Long Sleeve', 'Oversized'], Fabric: ['Cotton', 'Cotton Blend', 'Polyester', 'Organic'], Style: ['Solid', 'Printed', 'Striped', 'Embroidery'] } },
  { id: 'denim', title: 'Denim', label: 'Denim', code: 'MDN', hero: '/images/mens/denim.jpg', tagline: 'Timeless style. Built for more.', description: 'Durable construction. Contemporary fits. Trusted sourcing for leading global brands.', tabs: ['All', 'Jeans', 'Denim Jacket', 'Denim Shirt', 'Denim Shorts'], filters: { Fit: ['Slim Fit', 'Regular Fit', 'Relaxed Fit', 'Straight Fit', 'Tapered Fit'], Wash: ['Light Wash', 'Mid Wash', 'Dark Wash', 'Black', 'Vintage'], Style: ['Jeans', 'Denim Jacket', 'Denim Shirt', 'Denim Shorts'] } },
  { id: 'trousers', title: 'Trouser', label: 'Trousers', code: 'MTR', hero: '/images/mens/denim.jpg', tagline: 'Modern fits. Business to casual.', description: 'Tailored comfort. Versatile styles. Manufacturing excellence for global markets.', tabs: ['All', 'Chino', 'Formal', 'Cargo', 'Jogger', 'Linen'], filters: { Fit: ['Slim Fit', 'Regular Fit', 'Relaxed Fit', 'Straight Fit', 'Tapered Fit'], Fabric: ['Cotton', 'Cotton Blend', 'Linen', 'Wool Blend', 'Polyester'], Style: ['Chino', 'Formal', 'Cargo', 'Jogger', 'Linen'] } },
  { id: 'sweaters', title: 'Sweater', label: 'Sweaters', code: 'MSW', hero: '/images/mens/sweater.jpg', tagline: 'Warmer ideas. Greater possibilities.', description: 'Premium knits. Seasonal styles. Reliable production for global brands.', tabs: ['All', 'Crew Neck', 'V-Neck', 'Turtleneck', 'Cardigan', 'Half Zip'], filters: { Style: ['Crew Neck', 'V-Neck', 'Turtleneck', 'Cardigan', 'Half Zip'], Material: ['Cotton Knit', 'Wool', 'Cashmere Blend', 'Acrylic', 'Organic'], Pattern: ['Solid', 'Striped', 'Cable Knit', 'Jacquard'] } },
  { id: 'boxers', title: 'Boxer', label: 'Boxers', code: 'MBX', hero: '/images/hero.jpg', tagline: 'Comfort inside. Confidence outside.', description: 'Everyday comfort. Premium fabrics. Consistent quality for global markets.', tabs: ['All', 'Trunks', 'Boxer Brief', 'Boxer Shorts', 'Seamless', 'Performance'], filters: { Type: ['Trunks', 'Boxer Brief', 'Boxer Shorts', 'Seamless', 'Performance'], Material: ['Cotton', 'Modal', 'Bamboo', 'Microfiber', 'Stretch'], Pattern: ['Solid', 'Printed', 'Striped', 'Jacquard'] } },
];

const rows = {
  't-shirts': [
    ['Classic Crew Neck', 'Crew Neck', 'Cotton', 'Solid', '#dedbd2'], ['Polo T-Shirt', 'Polo Shirt', 'Cotton Blend', 'Solid', '#232628'], ['Oversized T-Shirt', 'Oversized', 'Cotton', 'Solid', '#373936'], ['Long Sleeve T-Shirt', 'Long Sleeve', 'Cotton Blend', 'Solid', '#74776c'], ['Striped T-Shirt', 'Crew Neck', 'Cotton', 'Striped', '#b4b0a3'], ['Graphic T-Shirt', 'Crew Neck', 'Polyester', 'Printed', '#2e3030'], ['V-Neck T-Shirt', 'V-Neck', 'Cotton', 'Solid', '#8e978e'], ['Organic Cotton T-Shirt', 'Crew Neck', 'Organic', 'Embroidery', '#e1ded3'],
  ],
  denim: [
    ['Slim Fit Jeans', 'Jeans', 'Slim Fit', 'Mid Wash', '#4f6879'], ['Regular Fit Jeans', 'Jeans', 'Regular Fit', 'Dark Wash', '#334f67'], ['Tapered Fit Jeans', 'Jeans', 'Tapered Fit', 'Light Wash', '#849fae'], ['Relaxed Fit Jeans', 'Jeans', 'Relaxed Fit', 'Black', '#363b40'], ['Denim Jacket', 'Denim Jacket', 'Regular Fit', 'Vintage', '#58728b'], ['Denim Shirt', 'Denim Shirt', 'Slim Fit', 'Mid Wash', '#6f8ca4'], ['Denim Shorts', 'Denim Shorts', 'Regular Fit', 'Light Wash', '#90a8b5'], ['Black Denim Jeans', 'Jeans', 'Straight Fit', 'Black', '#272d33'],
  ],
  trousers: [
    ['Chino Trouser', 'Chino', 'Regular Fit', 'Cotton', '#b7a589'], ['Formal Trouser', 'Formal', 'Slim Fit', 'Wool Blend', '#383d40'], ['Cargo Trouser', 'Cargo', 'Relaxed Fit', 'Cotton', '#5f6654'], ['Linen Trouser', 'Linen', 'Straight Fit', 'Linen', '#d4c9b5'], ['Slim Fit Trouser', 'Formal', 'Slim Fit', 'Polyester', '#727777'], ['Relaxed Trouser', 'Chino', 'Relaxed Fit', 'Cotton Blend', '#77786e'], ['Jogger Trouser', 'Jogger', 'Tapered Fit', 'Cotton Blend', '#333a3a'], ['Checked Trouser', 'Formal', 'Regular Fit', 'Wool Blend', '#aaa69a'],
  ],
  sweaters: [
    ['Crew Neck Sweater', 'Crew Neck', 'Cotton Knit', 'Solid', '#5a6054'], ['V-Neck Sweater', 'V-Neck', 'Wool', 'Solid', '#95765d'], ['Turtleneck Sweater', 'Turtleneck', 'Wool', 'Solid', '#2b2e31'], ['Cardigan Sweater', 'Cardigan', 'Cotton Knit', 'Solid', '#646c65'], ['Half Zip Sweater', 'Half Zip', 'Acrylic', 'Solid', '#304356'], ['Striped Sweater', 'Crew Neck', 'Cotton Knit', 'Striped', '#d4cebf'], ['Cable Knit Sweater', 'Crew Neck', 'Wool', 'Cable Knit', '#9b9484'], ['Cashmere Blend Sweater', 'V-Neck', 'Cashmere Blend', 'Solid', '#dad1be'],
  ],
  boxers: [
    ['Cotton Trunk', 'Trunks', 'Cotton', 'Solid', '#303338'], ['Boxer Brief', 'Boxer Brief', 'Modal', 'Solid', '#5e3039'], ['Printed Boxer', 'Boxer Shorts', 'Cotton', 'Printed', '#263b53'], ['Seamless Boxer Brief', 'Seamless', 'Microfiber', 'Solid', '#a5adb2'], ['Boxer Shorts', 'Boxer Shorts', 'Cotton', 'Solid', '#a7adae'], ['Modal Trunk', 'Trunks', 'Modal', 'Solid', '#d0d0c8'], ['Performance Boxer', 'Performance', 'Stretch', 'Solid', '#262c31'], ['Striped Boxer', 'Boxer Shorts', 'Bamboo', 'Striped', '#859eab'],
  ],
};

export const mensProducts = mensCategories.flatMap(category => rows[category.id].map(([name, type, a, b, color], index) => {
  const groups = Object.keys(category.filters);
  const attributes = category.id === 'denim' || category.id === 'trousers' ? { [groups[0]]: a, [groups[1]]: b, [groups[2]]: type } : { [groups[0]]: type, [groups[1]]: a, [groups[2]]: b };
  return { id: `RS-${category.code}-${String(index + 1).padStart(3, '0')}`, category: category.id, name, type, color, attributes, order: index, pattern: b === 'Striped' ? 'stripes' : b === 'Printed' ? 'print' : name.includes('Checked') ? 'check' : 'plain' };
}));
