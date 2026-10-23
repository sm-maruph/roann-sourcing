import { AdminSkeleton } from './AdminLoading';
import { useEffect, useState } from 'react';
import { ArrowUpRight, Eye, Image, Images, Pencil, Plus, Trash2 } from 'lucide-react';
import { adminRequest } from './api';
import { resources } from './resources';
import HomeSlidesEditor from './HomeSlidesEditor';
import RecordEditor from './RecordEditor';
import './banners.css';

const pages = [['about','About us'],['compliance','Compliance'],['mens','Men’s collection'],['womens','Women’s collection'],['girls','Girls’ collection']];
function Preview({ url, alt }) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false),[url]);
  return url && !failed ? <img src={url} alt={alt} loading="lazy" onError={() => setFailed(true)}/> : <div className="banner-image-placeholder"><Image size={27} strokeWidth={1.3}/><span>No banner image</span></div>;
}

export default function BannerManager() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [revision, setRevision] = useState(0);
  const [homeEditor, setHomeEditor] = useState(false);
  const [editor, setEditor] = useState(null);
  const [deleting, setDeleting] = useState(null);
  useEffect(() => {
    const controller = new AbortController(); setLoading(true);
    adminRequest('admin/hero_banners',{signal:controller.signal}).then(data => setRows(data.sort((a,b)=>a.sort_order-b.sort_order||a.id.localeCompare(b.id))))
      .catch(failure => {if(failure.name!=='AbortError') setError(failure.message);})
      .finally(()=>{if(!controller.signal.aborted) setLoading(false);});
    return () => controller.abort();
  },[revision]);
  const slides = rows.filter(row => row.page==='home');
  const featured = slides.find(row => row.is_active && row.image_url) || slides.find(row => row.image_url);
  function saved(message) {setHomeEditor(false);setEditor(null);setNotice(message);setError('');setRevision(value=>value+1);}
  async function remove() {
    setBusy(true);setError('');
    try {await adminRequest(`admin/hero_banners/${deleting.id}`,{method:'DELETE'});setDeleting(null);saved('Banner deleted. Unused uploaded images are removed from Storage.');}
    catch(failure){setError(failure.message);}finally{setBusy(false);}
  }
  if (loading) return <AdminSkeleton kind="banners" label="Loading page banners"/>;
  return <section className="banner-manager">
    <div className="banner-page-heading"><div><span className="banner-overline">WEBSITE APPEARANCE</span><h1>Page banners</h1><p>Give every page a strong first impression.</p></div><button className="admin-primary" disabled={loading} onClick={()=>setEditor({record:null,page:'about'})}><Plus size={15}/>Set page banner</button></div>
    <div className="banner-summary"><span><Images size={14}/><strong>{slides.length}</strong> homepage slides</span><span><Eye size={14}/><strong>{rows.filter(row=>row.is_active).length}</strong> visible banners</span><span><Image size={14}/><strong>{rows.filter(row=>row.page!=='home').length}</strong> page banners</span></div>
    {notice && <p className="admin-success" role="status">{notice}</p>}
    {error && <p className="admin-error" role="alert">{error}<button onClick={()=>{setError('');setRevision(value=>value+1);}}>Retry</button></p>}
    {deleting && <div className="admin-delete" role="alert"><p>Delete the {pages.find(([page])=>page===deleting.page)?.[1] || deleting.page} banner? Its unused uploaded image will also be removed from Storage.</p><button disabled={busy} onClick={()=>setDeleting(null)}>Cancel</button><button className="admin-danger" disabled={busy} onClick={remove}>Confirm delete</button></div>}
    {loading && !rows.length ? <p role="status">Loading banners…</p> : <div className="banner-workspace" aria-busy={loading}>
      <section className="banner-home-panel"><div className="banner-panel-heading"><div className="banner-panel-icon"><Images size={18}/></div><div><h2>Homepage hero</h2><p>Multiple images · Automatic slider</p></div><span className="banner-type-badge">SLIDER</span></div>
        <div className="banner-home-preview"><Preview url={featured?.image_url} alt="Homepage hero preview"/><span className="banner-home-preview-label">HOME / HERO SLIDER</span></div>
        <div className="banner-home-content"><div className="banner-strip-heading"><strong>Your slides</strong><span>{slides.filter(row=>row.is_active).length} visible / {slides.length} total</span></div>
          <div className="banner-slide-strip">{slides.map((slide,index)=><button key={slide.id} title={`Edit homepage slider · Slide ${index+1}`} aria-label={`Edit homepage slide ${index+1}`} onClick={()=>setHomeEditor(true)}><Preview url={slide.image_url} alt="home banner preview"/><span>{String(index+1).padStart(2,'0')}</span>{!slide.is_active && <i>Hidden</i>}</button>)}{!slides.length&&<p>Add images to create your homepage slider.</p>}</div>
          <p className="banner-home-help">Select several images at once, arrange their order, and choose which slides are visible.</p><button className="admin-primary banner-manage-slider" onClick={()=>setHomeEditor(true)}><Images size={15}/>Manage homepage slider</button><a className="banner-website-link" href="/" target="_blank" rel="noopener noreferrer">Preview homepage<ArrowUpRight size={14}/></a>
        </div>
      </section>
      <section className="banner-page-collection"><div className="banner-section-heading"><div><h2>Individual page banners</h2><p>One image for each page.</p></div><span>{pages.length} pages</span></div>
        <div className="banner-page-grid">{pages.map(([page,label])=>{
          const record=rows.find(row=>row.page===page);
          return <article className="banner-page-card" key={page} aria-label={`${label} banner`}><div className="banner-card-preview"><Preview url={record?.image_url} alt={`${page} banner preview`}/><span className={`banner-card-status${record?.is_active ? '' : ' is-muted'}`}>{record ? record.is_active ? 'Visible' : 'Hidden' : 'Not set'}</span></div><div className="banner-card-body"><div className="banner-card-title"><div><h3>{label}</h3><span>/{page}</span></div><a href={`/${page}`} target="_blank" rel="noopener noreferrer" aria-label={`Preview ${label} page`}><ArrowUpRight size={16}/></a></div><div className="banner-card-actions"><button onClick={()=>setEditor({record:record||null,page})}>{record?<Pencil size={13}/>:<Plus size={13}/>} {record?'Edit banner':'Add banner'}</button>{record&&<button className="banner-delete" aria-label={`Delete ${label} banner`} onClick={()=>{setError('');setDeleting(record);}}><Trash2 size={14}/></button>}</div></div></article>;
        })}</div>
      </section>
    </div>}
    {homeEditor&&<HomeSlidesEditor banners={rows} onClose={()=>setHomeEditor(false)} onSaved={()=>saved('Homepage slider saved.')}/>}
    {editor&&<RecordEditor resourceKey="hero_banners" resource={{...resources.hero_banners,defaults:{...resources.hero_banners.defaults,page:editor.page},fields:resources.hero_banners.fields.filter(field=>field.name!=='sort_order').map(field=>field.name==='page'?{...field,options:field.options.filter(page=>page!=='home')}:field)}} record={editor.record} categories={[]} onClose={()=>setEditor(null)} onSaved={()=>saved('Banner saved.')}/>}
  </section>;
}
