import { AdminSkeleton } from './AdminLoading';
import { useEffect, useState } from 'react';
import { ArrowDownRight, ArrowRight, ArrowUpRight, Boxes, Check, CirclePlus, Image, Inbox, Layers3, Package, RefreshCw, Shirt, Users } from 'lucide-react';
import { adminRequest } from './api';

const palette = ['#487968', '#8e83b7', '#d5a861', '#6b9cba', '#c58484'];
const format = number => new Intl.NumberFormat('en-GB').format(number);
const date = value => new Intl.DateTimeFormat('en-GB', {day:'numeric',month:'short',timeZone:'Asia/Dhaka'}).format(new Date(value));

export default function Dashboard({ onSelect }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [revision, setRevision] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true); setError('');
    adminRequest('admin/dashboard', {signal:controller.signal}).then(setData)
      .catch(failure => { if(failure.name !== 'AbortError') setError(failure.message); })
      .finally(() => { if(!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  },[revision]);
  const today = new Intl.DateTimeFormat('en-GB',{weekday:'long',day:'numeric',month:'long',year:'numeric',timeZone:'Asia/Dhaka'}).format(new Date());
  const quoteTotal = data?.weeklyQuotes.reduce((sum,day) => sum+day.count,0) || 0;
  const maxQuotes = Math.max(1,...(data?.weeklyQuotes.map(day => day.count) || []));
  if (loading) return <AdminSkeleton kind="dashboard" label="Loading overview"/>;
  return <section className="dashboard" aria-busy={loading}>
    <div className="dashboard-heading"><div><p className="dashboard-overline">YOUR BUSINESS, AT A GLANCE</p><h1>Welcome to your dashboard</h1><p>Here’s what’s happening at Roann Sourcing today.</p></div><div className="dashboard-heading-actions"><span>{today}</span><button aria-label="Refresh dashboard" disabled={loading} onClick={() => setRevision(value => value+1)}><RefreshCw size={16} className={loading ? 'dashboard-spinning' : ''}/></button></div></div>
    {error && <div className="admin-error" role="alert">{error}<button onClick={() => setRevision(value => value+1)}>Retry</button></div>}
    {!data && loading && <div className="dashboard-loading" role="status">Loading your business overview…</div>}
    {data && <>
      <div className="dashboard-stats">{[
        ['products','Total products',data.products.total,`${data.products.active} visible · ${data.products.hidden} hidden`,Package,'sage'],
        ['quotes','Quote requests',data.quotes.total,`${data.quotes.new} new requests to review`,Inbox,'lavender'],
        ['categories','Categories',data.categories.total,`${data.categories.groups} groups · ${data.categories.subcategories} subcategories`,Layers3,'sand'],
        ['partners','Brand partners',data.partners.total,`${data.partners.active} visible on your website`,Users,'blue'],
      ].map(([key,label,value,caption,Icon,tone]) => <button key={key} className={`dashboard-stat tone-${tone}`} onClick={() => onSelect(key)}><span className="dashboard-stat-top"><span>{label}</span><i><Icon size={20}/></i></span><strong>{format(value)}</strong><span className="dashboard-stat-bottom">{caption}<ArrowUpRight size={15}/></span></button>)}</div>
      <div className="dashboard-main-grid">
        <section className="dashboard-panel dashboard-activity"><div className="dashboard-panel-heading"><div><h2>Enquiry activity</h2><p>Customer requests over the last 7 days</p></div><span className="dashboard-period">Last 7 days</span></div><div className="dashboard-activity-total"><strong>{format(quoteTotal)}</strong><span>requests received</span></div><div className="dashboard-chart" role="img" aria-label={`Requests by day: ${data.weeklyQuotes.map(day=>`${day.day}: ${day.count}`).join(', ')}`}>
          {data.weeklyQuotes.map(day => <div key={day.day} className="dashboard-chart-column"><div className="dashboard-chart-track"><div className={`dashboard-chart-bar${day.count ? '' : ' is-zero'}`} style={{height:`${day.count ? Math.max(6,day.count/maxQuotes*100) : 2}%`}} title={`${date(day.day)}: ${day.count} requests`}><span>{day.count}</span></div></div><span>{new Intl.DateTimeFormat('en-GB',{weekday:'short',timeZone:'Asia/Dhaka'}).format(new Date(day.day))}</span></div>)}
        </div><div className="dashboard-chart-footer"><span><i/>Quote requests</span><span>Dhaka time</span></div></section>
        <section className="dashboard-panel"><div className="dashboard-panel-heading"><div><h2>Catalog overview</h2><p>Top categories by product count</p></div><Boxes size={19}/></div><div className="dashboard-category-total"><strong>{format(data.products.total)}</strong><span>products in your catalog</span></div><div className="dashboard-category-bars">{data.categoryProducts.slice(0,3).map((category,index) => <div key={category.id}><div><span><i style={{background:palette[index%palette.length]}}/>{category.name}</span><strong>{format(category.count)}</strong></div><div className="dashboard-meter"><i style={{width:`${data.products.total ? category.count/data.products.total*100 : 0}%`,background:palette[index%palette.length]}}/></div></div>)}{!data.categoryProducts.length && <p>No categories yet. Create a category to organize your products.</p>}</div><button className="dashboard-text-link" onClick={() => onSelect('categories')}>Manage categories<ArrowRight size={15}/></button></section>
      </div>
      <div className="dashboard-lower-grid"><section className="dashboard-panel dashboard-recent"><div className="dashboard-panel-heading"><div><h2>Recent quote requests</h2><p>Your latest customer conversations</p></div><button className="dashboard-text-link" onClick={() => onSelect('quotes')}>View all<ArrowRight size={14}/></button></div>{data.recentQuotes.length ? <div className="dashboard-request-list">{data.recentQuotes.slice(0,3).map(quote => <button key={quote.id} onClick={() => onSelect('quotes')}><span className="dashboard-customer-avatar">{quote.name.slice(0,1).toUpperCase()}</span><span className="dashboard-request-copy"><strong>{quote.name}</strong><small>{quote.product_name}</small></span><span className={`dashboard-status status-${quote.status}`}>{quote.status}</span><time>{date(quote.created_at)}</time></button>)}</div> : <div className="dashboard-empty"><Inbox size={28}/><h3>Your inbox is ready</h3><p>New quote requests will appear here when customers get in touch.</p></div>}</section>
      <section className="dashboard-panel"><div className="dashboard-panel-heading"><div><h2>Request pipeline</h2><p>Keep every conversation moving</p></div><ArrowDownRight size={19}/></div><div className="dashboard-pipeline">{[['new','New requests'],['reviewing','Under review'],['responded','Responded'],['closed','Closed']].map(([key,label]) => <div key={key}><span><i className={`pipeline-dot status-${key}`}/>{label}</span><strong>{format(data.quotes[key])}</strong></div>)}</div><div className="dashboard-pipeline-note"><Check size={15}/>{format(data.quotes.customers)} unique customer{data.quotes.customers===1?'':'s'} in your inbox</div></section></div>
      <div className="dashboard-bottom-grid"><section className="dashboard-panel"><div className="dashboard-panel-heading"><div><h2>Recently added products</h2><p>The newest additions to your catalog</p></div><button className="dashboard-text-link" onClick={()=>onSelect('products')}>View products<ArrowRight size={14}/></button></div><div className="dashboard-new-products">{data.recentProducts.slice(0,3).map(product => <button key={product.id} onClick={()=>onSelect('products')}><span>{product.image_url ? <img src={product.image_url} alt=""/> : <Shirt size={24}/>}</span><div><strong>{product.name}</strong><small>{product.sku}</small></div><span className={`dashboard-status ${product.is_active?'status-responded':'status-closed'}`}>{product.is_active?'Visible':'Hidden'}</span></button>)}{!data.recentProducts.length && <p>Add your first product to start building your catalog.</p>}</div></section>
      <section className="dashboard-quick-panel"><div className="dashboard-quick-icon"><CirclePlus size={24}/></div><h2>Make room for what’s next.</h2><p>Keep your catalog fresh and your brand looking its best.</p><button onClick={()=>onSelect('products')}>Manage products<ArrowRight size={16}/></button><button className="dashboard-banner-link" onClick={()=>onSelect('hero_banners')}><Image size={16}/>{data.banners.home} homepage slide{data.banners.home===1?'':'s'} · {data.banners.active} active banners<ArrowUpRight size={15}/></button></section></div>
      <footer className="dashboard-footer"><span>Roann Sourcing · Administration</span><span>Live counts from your database</span></footer>
    </>}
  </section>;
}
