import { useEffect, useRef, useState } from 'react';
import { LogOut, X } from 'lucide-react';

export default function AdminExitGuard({ enabled }) {
  const [pending,setPending]=useState(null);
  const dialog=useRef(null);
  const allow=useRef(false);
  const restoring=useRef(false);
  const previousEntry=useRef(false);
  useEffect(()=>{
    if(!enabled){setPending(null);return;}
    allow.current=false;
    const state=window.history.state||{};
    if(state.__roannAdminGuard==='top') previousEntry.current=Boolean(state.__roannAdminPrevious);
    else {
      previousEntry.current=state.__roannAdminPrevious ?? (window.navigation?.currentEntry ? window.navigation.currentEntry.index>0 : window.history.length>1);
      const base={...state,__roannAdminGuard:'base',__roannAdminPrevious:previousEntry.current};
      window.history.replaceState(base,'',window.location.href);
      window.history.pushState({...base,__roannAdminGuard:'top'},'',window.location.href);
    }
    function click(event){
      if(allow.current||event.defaultPrevented||event.button!==0)return;
      const anchor=event.target instanceof Element?event.target.closest('a[href]'):null;
      if(!anchor||anchor.hasAttribute('download'))return;
      const url=new URL(anchor.href,window.location.href);
      if(!['http:','https:','mailto:','tel:'].includes(url.protocol))return;
      if(url.origin===window.location.origin&&(url.pathname==='/admin'||url.pathname.startsWith('/admin/')))return;
      event.preventDefault();event.stopPropagation();
      setPending({kind:'link',url:url.href,target:event.ctrlKey||event.metaKey?'_blank':anchor.target||'_self'});
    }
    function back(event){
      if(allow.current)return;
      if(restoring.current){restoring.current=false;setPending({kind:'back'});return;}
      if(event.state?.__roannAdminGuard==='top')return;
      restoring.current=true;window.history.go(1);
    }
    function unload(event){if(!allow.current){event.preventDefault();event.returnValue='';}}
    function resume(){allow.current=false;}
    document.addEventListener('click',click,true);
    window.addEventListener('popstate',back);
    window.addEventListener('beforeunload',unload);
    window.addEventListener('pageshow',resume);
    return()=>{document.removeEventListener('click',click,true);window.removeEventListener('popstate',back);window.removeEventListener('beforeunload',unload);window.removeEventListener('pageshow',resume);};
  },[enabled]);
  useEffect(()=>{if(pending&&!dialog.current.open)dialog.current.showModal();else if(!pending&&dialog.current?.open)dialog.current.close();},[pending]);
  function leave(){
    const destination=pending;setPending(null);
    if(destination.kind==='back'){
      allow.current=true;
      if(previousEntry.current)window.history.go(-2);else window.location.assign('/');
    }else if(destination.target==='_blank')window.open(destination.url,'_blank','noopener,noreferrer');
    else {allow.current=true;window.location.assign(destination.url);if(!/^https?:/.test(destination.url))window.setTimeout(()=>{allow.current=false;},0);}
  }
  return <dialog ref={dialog} className="admin-exit-dialog" aria-labelledby="admin-exit-title" aria-describedby="admin-exit-description" onCancel={event=>{event.preventDefault();setPending(null);}}><button className="admin-exit-close" aria-label="Close exit warning" onClick={()=>setPending(null)}><X size={16}/></button><div className="admin-exit-symbol"><LogOut size={24}/></div><h2 id="admin-exit-title">Leave the admin panel?</h2><p id="admin-exit-description">You’re about to open a page outside your workspace. Save any changes before you continue.</p><div className="admin-exit-actions"><button onClick={()=>setPending(null)}>Stay in admin</button><button className="admin-primary" onClick={leave}>Leave admin<LogOut size={14}/></button></div></dialog>;
}
