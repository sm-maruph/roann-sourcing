import '../styles/collection-loading.css';

export default function CollectionLoading({ audience = 'Apparel' }) {
  return <main className="collection-loading" aria-busy="true" aria-label={`${audience} collection`}>
    <div className="collection-loading-nav" aria-hidden="true"><div className="container"><span className="loading-block"/>{[0, 1, 2, 3].map(item => <i className="loading-block" key={item}/>)}</div></div>
    <section className="collection-loading-hero"><div className="container">
      <p className="eyebrow">ROANN SOURCING</p>
      <h1>{audience} Collection</h1>
      <div className="collection-loading-status" role="status"><span className="collection-loading-spinner" aria-hidden="true"/>Loading collection…</div>
      <div className="collection-loading-copy" aria-hidden="true"><span className="loading-block"/><span className="loading-block"/></div>
    </div></section>
    <div className="container collection-loading-content" aria-hidden="true">
      <aside className="collection-loading-filters"><span className="loading-block loading-heading"/>{[0, 1, 2].map(group => <div key={group}><span className="loading-block loading-filter-heading"/>{[0, 1, 2, 3].map(row => <span className="loading-block loading-filter-row" key={row}/>)}</div>)}</aside>
      <div className="collection-loading-products"><div className="collection-loading-toolbar"><span className="loading-block"/><span className="loading-block"/></div>
        <div className="collection-loading-grid">{[0, 1, 2, 3, 4, 5].map(item => <div className="collection-loading-card" key={item}><div className="loading-block loading-product-image"/><div className="loading-product-copy"><span className="loading-block"/><span className="loading-block"/><span className="loading-block"/></div></div>)}</div>
      </div>
    </div>
  </main>;
}
