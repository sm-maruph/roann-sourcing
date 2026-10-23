export default function CatalogPagination({ page, pageCount, onChange }) {
  const pages = [...new Set([1, page - 1, page, page + 1, pageCount])]
    .filter(value => value >= 1 && value <= pageCount).sort((a, b) => a - b);

  return <nav className="catalog-pagination" aria-label="Product pages">
    <button disabled={page === 1} onClick={() => onChange(page - 1)}>Previous</button>
    <div className="catalog-page-numbers">{pages.map((number, index) => <span key={number}>
      {index > 0 && number - pages[index - 1] > 1 && <span className="pagination-gap" aria-hidden="true">…</span>}
      <button aria-label={`Page ${number}`} aria-current={page === number ? 'page' : undefined} onClick={() => onChange(number)}>{number}</button>
    </span>)}</div>
    <button disabled={page === pageCount} onClick={() => onChange(page + 1)}>Next</button>
  </nav>;
}
