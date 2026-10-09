export default function CatalogFilters({ category, filters, onToggle, onClear, prefix = 'catalog' }) {
  const count = Object.values(filters).flat().length;
  return <div className="catalog-filter-content"><div className="filter-heading"><h2>Filter</h2>{count > 0 && <button onClick={onClear}>Clear all ({count})</button>}</div>{Object.entries(category.filters).map(([group, options]) => <fieldset key={group}><legend>{group}</legend>{options.map(option => { const id = `${prefix}-${group}-${option}`.replaceAll(' ', '-'); return <label htmlFor={id} key={option}><input id={id} type="checkbox" checked={(filters[group] || []).includes(option)} onChange={() => onToggle(group, option)}/><span>{option}</span></label>; })}</fieldset>)}</div>;
}
