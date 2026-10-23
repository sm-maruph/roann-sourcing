import { AdminSkeleton } from './AdminLoading';
import { useEffect, useState } from 'react';
import { ArrowUpRight, Eye, Handshake, Image, Pencil, Plus, Search, Trash2 } from 'lucide-react';
import { adminRequest } from './api';
import { resources } from './resources';
import RecordEditor from './RecordEditor';
import './partners.css';

function website(value) {
  try {const url=new URL(value);return url.protocol==='https:'?{url:url.href,label:url.hostname.replace(/^www\./,'')}:null;}catch{return null;}
}
function PartnerLogo({ partner }) {
  const [failed,setFailed]=useState(false);
  useEffect(()=>setFailed(false),[partner.image_url]);
  return partner.image_url&&!failed?<img src={partner.image_url} alt={`${partner.name} logo`} loading="lazy" onError={()=>setFailed(true)}/>:<div className="partner-logo-fallback"><span>{partner.name}</span><small>Logo not uploaded</small></div>;
}
export default function PartnerManager() {
  const [rows,setRows]=useState([]);
  const [loading,setLoading]=useState(true);
  const [error,setError]=useState('');
  const [notice,setNotice]=useState('');
  const [revision,setRevision]=useState(0);
  const [search,setSearch]=useState('');
  const [visibility,setVisibility]=useState('all');
  const [sort,setSort]=useState('order');
  const [page,setPage]=useState(1);
  const [editor,setEditor]=useState(null);
  const [deleting,setDeleting]=useState(null);
  const [busy,setBusy]=useState(false);
  useEffect(()=>{
    const controller=new AbortController();setLoading(true);
    adminRequest('admin/partners',{signal:controller.signal}).then(setRows)
      .catch(failure=>{if(failure.name!=='AbortError')setError(failure.message);})
      .finally(()=>{if(!controller.signal.aborted)setLoading(false);});
    return()=>controller.abort();
  },[revision]);
  const filtered=rows.filter(row=>`${row.name} ${row.website_url}`.toLowerCase().includes(search.toLowerCase())&&(visibility==='all'||row.is_active===(visibility==='visible')))
    .sort((a,b)=>(sort==='name'?a.name.localeCompare(b.name):sort==='newest'?Date.parse(b.created_at)-Date.parse(a.created_at):a.sort_order-b.sort_order)||a.name.localeCompare(b.name)||a.id.localeCompare(b.id));
  const pageCount=Math.max(1,Math.ceil(filtered.length/16));
  const currentPage=Math.min(page,pageCount);
  const visible=filtered.slice((currentPage-1)*16,currentPage*16);
  async function remove(){
    setBusy(true);setError('');
    try{await adminRequest(`admin/partners/${deleting.id}`,{method:'DELETE'});setDeleting(null);setNotice('Partner deleted. Unused logo files are removed from Storage.');setRevision(value=>value+1);}
    catch(failure){setError(failure.message);}finally{setBusy(false);}
  }
  if (loading) return <AdminSkeleton kind="partners" label="Loading partners"/>;
  return <section className="partner-manager">
    <div className="partner-page-heading"><div><span className="partner-overline">BRAND RELATIONSHIPS</span><h1>Partners</h1><p>Showcase the brands that grow with you.</p></div><button className="admin-primary" disabled={loading} onClick={()=>{setNotice('');setEditor({record:null});}}><Plus size={15}/>Add partner</button></div>
    <div className="partner-stats">{[[Handshake,'Total partners',rows.length,'sage'],[Eye,'Visible on website',rows.filter(row=>row.is_active).length,'blue'],[Image,'Logos uploaded',rows.filter(row=>row.image_url).length,'lavender']].map(([Icon,label,count,tone])=><div className={`partner-stat partner-tone-${tone}`} key={label}><i><Icon size={18}/></i><div><span>{label}</span><strong>{count}</strong></div></div>)}</div>
    <div className="partner-toolbar"><div className="partner-search"><Search size={15}/><input aria-label="Search partners" placeholder="Search partner name or website..." type="search" value={search} onChange={event=>{setSearch(event.target.value);setPage(1);}}/></div><div><label htmlFor="partner-visibility">Visibility</label><select id="partner-visibility" value={visibility} onChange={event=>{setVisibility(event.target.value);setPage(1);}}><option value="all">All partners</option><option value="visible">Visible only</option><option value="hidden">Hidden only</option></select></div><div><label htmlFor="partner-sort">Sort partners</label><select id="partner-sort" value={sort} onChange={event=>{setSort(event.target.value);setPage(1);}}><option value="order">Display order</option><option value="name">Name: A to Z</option><option value="newest">Newest first</option></select></div><span className="partner-result-count" role="status">{filtered.length} partners</span></div>
    {notice&&<p className="admin-success" role="status">{notice}</p>}
    {error&&<p className="admin-error" role="alert">{error}<button onClick={()=>{setError('');setRevision(value=>value+1);}}>Retry</button></p>}
    {deleting&&<div className="admin-delete" role="alert"><p>Delete “{deleting.name}”? The partner will be removed from the website and its unused uploaded logo deleted from Storage.</p><button disabled={busy} onClick={()=>setDeleting(null)}>Cancel</button><button className="admin-danger" disabled={busy} onClick={remove}>Confirm delete</button></div>}
    {loading?<p role="status">Loading partners…</p>:<>
      <div className="partner-grid">{visible.map(partner=>{const link=website(partner.website_url);return <article className="partner-card" aria-label={partner.name} key={partner.id}>
        <div className="partner-logo-area"><PartnerLogo partner={partner}/><span className={`partner-visibility${partner.is_active?'':' is-hidden'}`}>{partner.is_active?'Visible':'Hidden'}</span><span className="partner-order">#{String(partner.sort_order).padStart(2,'0')}</span></div>
        <div className="partner-card-body"><h2 title={partner.name}>{partner.name}</h2>{link?<a className="partner-site" href={link.url} target="_blank" rel="noopener noreferrer"><span>{link.label}</span><ArrowUpRight size={13}/></a>:<span className="partner-no-site">Website not added</span>}<div className="partner-card-actions"><button onClick={()=>setEditor({record:partner})}><Pencil size={13}/>Edit</button><button className="partner-delete" onClick={()=>{setError('');setDeleting(partner);}}><Trash2 size={13}/>Delete</button></div></div>
      </article>;})}</div>
      {!visible.length&&<div className="partner-empty"><Handshake size={35}/><h2>{rows.length?'No matching partners':'Build your partner showcase'}</h2><p>{rows.length?'Try another search or visibility filter.':'Add a partner and upload its logo to display it on your homepage.'}</p></div>}
      <div className="admin-pagination"><button disabled={currentPage===1} onClick={()=>setPage(currentPage-1)}>Previous</button><span>Page {currentPage} of {pageCount}</span><button disabled={currentPage===pageCount} onClick={()=>setPage(currentPage+1)}>Next</button></div>
    </>}
    {editor&&<RecordEditor resourceKey="partners" resource={{...resources.partners,defaults:{...resources.partners.defaults,sort_order:rows.reduce((max,row)=>Math.max(max,row.sort_order+1),0)}}} record={editor.record} categories={[]} onClose={()=>setEditor(null)} onSaved={()=>{setEditor(null);setNotice('Partner saved.');setRevision(value=>value+1);}}/>}
  </section>;
}
