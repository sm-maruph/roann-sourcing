import { AdminSkeleton } from './AdminLoading';
import { useEffect, useState } from 'react';
import { Building2, CalendarDays, CheckCheck, Clock3, Inbox, Mail, MessageSquare, Package, RefreshCw, Search, User } from 'lucide-react';
import { adminRequest } from './api';
import './quotes.css';

const statuses=[['new','New'],['reviewing','Under review'],['responded','Responded'],['closed','Closed']];
const date=value=>new Intl.DateTimeFormat('en-GB',{day:'2-digit',month:'short',year:'numeric',timeZone:'Asia/Dhaka'}).format(new Date(value));
const time=value=>new Intl.DateTimeFormat('en-GB',{hour:'2-digit',minute:'2-digit',second:'2-digit',hour12:true,timeZone:'Asia/Dhaka'}).format(new Date(value));
const statusName=value=>statuses.find(([key])=>key===value)?.[1]||value;

function QuoteDetail({quote,onSaved}){
  const [status,setStatus]=useState(quote.status);
  const [notes,setNotes]=useState(quote.admin_notes||'');
  const [busy,setBusy]=useState(false);
  const [error,setError]=useState('');
  async function save(event){
    event.preventDefault();setBusy(true);setError('');
    try{await adminRequest(`admin/quotes/${quote.id}`,{method:'PATCH',body:{status,admin_notes:notes}});onSaved();}
    catch(failure){setError(failure.message);}finally{setBusy(false);}
  }
  return <article className="quote-detail" aria-label="Request details"><div className="quote-detail-heading"><div><span className="quote-detail-overline">REQUEST DETAILS</span><h2>{quote.product_name}</h2>{quote.product_sku&&<p>{quote.product_sku}{quote.color&&` / ${quote.color}`}</p>}</div><span className={`quote-status quote-status-${quote.status}`}>{statusName(quote.status)}</span></div>
    <div className="quote-received"><CalendarDays size={17}/><div><span>Requested on</span><time dateTime={quote.created_at}>{date(quote.created_at)} <strong>{time(quote.created_at)}</strong></time></div><span className="quote-timezone">Dhaka · GMT+6</span></div>
    <div className="quote-customer-grid">{[[User,'Customer',quote.name],[Building2,'Company',quote.company||'Not provided'],[Mail,'Email',quote.email],[Package,'Quantity',quote.quantity?`${new Intl.NumberFormat('en-GB').format(quote.quantity)} pieces`:'To be discussed']].map(([Icon,label,value])=><div key={label}><Icon size={15}/><div><span>{label}</span>{label==='Email'?<a href={`mailto:${quote.email}`}>{value}</a>:<strong>{value}</strong>}</div></div>)}</div>
    <div className="quote-message"><h3><MessageSquare size={15}/>Customer requirements</h3><p>{quote.message||'No additional requirements provided.'}</p></div>
    <form className="quote-workflow" onSubmit={save}><h3>Manage this request</h3><fieldset disabled={busy}><div><label htmlFor={`quote-status-${quote.id}`}>Status</label><select id={`quote-status-${quote.id}`} value={status} onChange={event=>setStatus(event.target.value)}>{statuses.map(([key,label])=><option key={key} value={key}>{label}</option>)}</select></div><div><label htmlFor={`quote-notes-${quote.id}`}>Private notes</label><textarea id={`quote-notes-${quote.id}`} value={notes} rows={3} maxLength={5000} placeholder="Next steps, pricing details or follow-up notes..." onChange={event=>setNotes(event.target.value)}/></div></fieldset>{error&&<p className="admin-error" role="alert">{error}</p>}<div className="quote-workflow-footer"><span><Clock3 size={12}/>Updated {date(quote.updated_at)}, {time(quote.updated_at)}</span><button type="submit" className="admin-primary" disabled={busy}><CheckCheck size={14}/>{busy?'Saving...':'Save request'}</button></div></form>
  </article>;
}

export default function QuoteInbox(){
  const [status,setStatus]=useState('');
  const [search,setSearch]=useState('');
  const [query,setQuery]=useState('');
  const [sort,setSort]=useState('newest');
  const [page,setPage]=useState(1);
  const [data,setData]=useState({rows:[],total:0});
  const [summary,setSummary]=useState(null);
  const [selectedId,setSelectedId]=useState(null);
  const [loading,setLoading]=useState(true);
  const [error,setError]=useState('');
  const [notice,setNotice]=useState('');
  const [revision,setRevision]=useState(0);
  useEffect(()=>{const timer=setTimeout(()=>{setQuery(search);setPage(1);},250);return()=>clearTimeout(timer);},[search]);
  useEffect(()=>{
    const controller=new AbortController();setLoading(true);setError('');
    const params=new URLSearchParams({page:String(page),sort});if(status)params.set('status',status);if(query)params.set('q',query);
    Promise.all([adminRequest(`admin/quotes?${params}`,{signal:controller.signal}),adminRequest('admin/quotes/summary',{signal:controller.signal})]).then(([result,counts])=>{setData(result);setSummary(counts);setSelectedId(previous=>result.rows.some(row=>row.id===previous)?previous:result.rows[0]?.id||null);})
      .catch(failure=>{if(failure.name!=='AbortError')setError(failure.message);})
      .finally(()=>{if(!controller.signal.aborted)setLoading(false);});
    return()=>controller.abort();
  },[page,status,query,sort,revision]);
  const updating=loading||search!==query;
  const pages=Math.max(1,Math.ceil(data.total/25));
  useEffect(()=>{if(!loading&&page>pages)setPage(pages);},[loading,page,pages]);
  const selected=data.rows.find(row=>row.id===selectedId);
  return <section className="quote-inbox">
    <div className="quote-page-heading"><div><span className="quote-overline">CUSTOMER CONVERSATIONS</span><h1>Quote requests</h1><p>Every enquiry, its details, and the next step in one place.</p></div><button disabled={updating} aria-label="Refresh quote requests" onClick={()=>setRevision(value=>value+1)}><RefreshCw size={15}/>Refresh</button></div>
    <div className="quote-stats">{[[Inbox,'Total requests','total'],[Mail,'New enquiries','new'],[Clock3,'Under review','reviewing'],[CalendarDays,'Received today','today']].map(([Icon,label,key])=><div key={key}><i><Icon size={18}/></i><span>{label}</span><strong>{summary?summary[key]:'—'}</strong></div>)}</div>
    <div className="quote-toolbar"><div className="quote-search"><Search size={15}/><input type="search" aria-label="Search quote requests" placeholder="Search customer, email, company or product..." maxLength={200} value={search} onChange={event=>setSearch(event.target.value)}/></div><div><label htmlFor="quote-status-filter">Filter status</label><select id="quote-status-filter" value={status} onChange={event=>{setStatus(event.target.value);setPage(1);}}><option value="">All requests</option>{statuses.map(([key,label])=><option key={key} value={key}>{label}{summary?` (${summary[key]})`:''}</option>)}</select></div><div><label htmlFor="quote-sort">Sort requests</label><select id="quote-sort" value={sort} onChange={event=>{setSort(event.target.value);setPage(1);}}><option value="newest">Newest first</option><option value="oldest">Oldest first</option></select></div></div>
    {notice&&<p className="admin-success" role="status">{notice}</p>}{error&&<p className="admin-error" role="alert">{error}<button onClick={()=>setRevision(value=>value+1)}>Retry</button></p>}
    {updating?<AdminSkeleton kind="quotes" label="Loading quote requests"/>:data.rows.length?<div className="quote-workspace"><section className="quote-request-list" aria-label="Customer requests"><div className="quote-list-heading"><h2>Inbox</h2><span>{data.total} requests</span></div>{data.rows.map(quote=><button className={`quote-inbox-item${quote.id===selectedId?' is-selected':''}`} key={quote.id} aria-pressed={quote.id===selectedId} onClick={()=>setSelectedId(quote.id)}><span className="quote-item-top"><strong>{quote.name}</strong><span className={`quote-status quote-status-${quote.status}`}>{statusName(quote.status)}</span></span><span className="quote-item-product">{quote.product_name}</span><span className="quote-item-message">{quote.message||quote.company||'View request details'}</span><span className="quote-item-time"><Clock3 size={11}/><time dateTime={quote.created_at}>{date(quote.created_at)} · {time(quote.created_at)}</time></span></button>)}</section>{selected&&<QuoteDetail key={`${selected.id}-${selected.updated_at}`} quote={selected} onSaved={()=>{setNotice('Request updated.');setRevision(value=>value+1);}}/>}</div>:<div className="quote-empty"><Inbox size={36}/><h2>No quote requests found.</h2><p>{query||status?'Try another search or status filter.':'Customer enquiries will appear here when they submit a request.'}</p></div>}
    <div className="quote-pagination"><span>All request times are shown in Dhaka time (GMT+6).</span><div className="admin-pagination"><button disabled={updating||page===1} onClick={()=>setPage(page-1)}>Previous</button><span>Page {page} of {pages}</span><button disabled={updating||page>=pages} onClick={()=>setPage(page+1)}>Next</button></div></div>
  </section>;
}
