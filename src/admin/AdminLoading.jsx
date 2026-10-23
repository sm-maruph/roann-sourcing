import './admin-feedback.css';

export const adminLogo = '/images/WhatsApp_Image_2026-10-08_at_6.24.40_PM-removebg-preview.png';
export function AdminLogo({ className = '' }) {
  return <img className={`admin-actual-logo ${className}`} src={adminLogo} alt="Roann Sourcing" width="510" height="148"/>;
}

export default function AdminLoading({ label = 'Loading administration', overlay = false }) {
  return <div className={`admin-route-loader${overlay ? ' is-overlay' : ''}`} role="status" aria-live="polite"><div className="admin-loader-mark"><AdminLogo/></div><div className="admin-loader-progress"><span/></div><p>{label}</p><span className="admin-loader-caption">Your Roann Sourcing workspace</span></div>;
}

const Block = ({ className = '' }) => <span className={`admin-skeleton-block ${className}`}/>;
export function AdminSkeleton({ kind = 'products', label = 'Loading content' }) {
  const dashboard = kind === 'dashboard';
  return <div className={`admin-skeleton admin-skeleton-${kind}`} role="status" aria-label={label} aria-busy="true">
    <span className="admin-feedback-sr">{label}</span>
    <div className="admin-skeleton-brand" aria-hidden="true"><span><AdminLogo/></span><i/><small>{label}</small></div>
    <div className="admin-skeleton-layout" aria-hidden="true">
      {dashboard ? <><div className="admin-skeleton-stats">{Array.from({length:4},(_,i)=><div className="admin-skeleton-card" key={i}><Block className="skeleton-line w-60"/><Block className="skeleton-number"/><Block className="skeleton-line w-80"/></div>)}</div><div className="admin-skeleton-panels">{Array.from({length:6},(_,i)=><div className="admin-skeleton-card" key={i}><Block className="skeleton-line w-60"/><Block className="skeleton-wide"/><Block className="skeleton-line w-80"/></div>)}</div></>
        : ['categories','quotes','banners'].includes(kind) ? <div className="admin-skeleton-split"><div className="admin-skeleton-card"><Block className="skeleton-line w-60"/>{Array.from({length:4},(_,i)=><div className="skeleton-list-item" key={i}><Block className="skeleton-avatar"/><div><Block className="skeleton-line w-80"/><Block className="skeleton-line w-60"/></div></div>)}</div><div className="admin-skeleton-card"><Block className="skeleton-line w-60"/><Block className="skeleton-feature"/><Block className="skeleton-line w-80"/><Block className="skeleton-line w-60"/><Block className="skeleton-wide"/></div></div>
        : <div className="admin-skeleton-grid">{Array.from({length:kind==='partners'?8:10},(_,i)=><div className="admin-skeleton-card" key={i}><Block className="skeleton-image"/><div className="skeleton-card-copy"><Block className="skeleton-line w-80"/><Block className="skeleton-line w-60"/><Block className="skeleton-line w-80"/><div className="skeleton-actions"><Block/><Block/><Block/></div></div></div>)}</div>}
    </div>
  </div>;
}
