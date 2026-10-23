import AdminLoading, { AdminLogo } from './AdminLoading';
import AdminExitGuard from './AdminExitGuard';
import PartnerManager from './PartnerManager';
import BannerManager from './BannerManager';
import Dashboard from './Dashboard';
import { LayoutDashboard, Package, Layers3, Image, Handshake, Inbox, ArrowUpRight, ChevronRight, LogOut, ShieldCheck, Menu, X } from 'lucide-react';
import CategoryManager from './CategoryManager';
import { useCallback, useEffect, useState } from 'react';
import { TranslationScope } from '../i18n/TranslationScope';
import { adminRequest, hasSession, setSession } from './api';
import { resources } from './resources';
import CollectionManager from './CollectionManager';
import QuoteInbox from './QuoteInbox';
import './admin.css';
import './dashboard.css';

function Login({ notice, onLogin }) {
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  async function login(event) {
    event.preventDefault(); setBusy(true); setError('');
    const fields = new FormData(event.currentTarget);
    try {
      const session = await adminRequest('auth/login', { method: 'POST', body: { email: fields.get('email').trim(), password: fields.get('password') } });
      setSession(session.token); onLogin({ email: session.email });
    } catch (failure) { setError(failure.message); }
    finally { setBusy(false); }
  }
  return <main className="admin-login"><a className="admin-brand" href="/" aria-label="Roann Sourcing home"><AdminLogo/></a>
    <form className="admin-login-card" onSubmit={login}>
      <p className="admin-eyebrow">Website management</p><h1>Admin sign in</h1><p>Sign in with your administrator account.</p>
      {notice && <p role="status" className="admin-notice">{notice}</p>}{error && <p role="alert" className="admin-error">{error}</p>}
      <fieldset className="admin-fields" disabled={busy}>
        <label htmlFor="admin-email">Email address<input id="admin-email" name="email" type="email" autoComplete="username" required maxLength={200}/></label>
        <label htmlFor="admin-password">Password<input id="admin-password" name="password" type={showPassword ? 'text' : 'password'} autoComplete="current-password" required maxLength={1024}/></label>
        <label className="admin-check"><input type="checkbox" checked={showPassword} onChange={event => setShowPassword(event.target.checked)}/>Show password</label>
        <button className="admin-primary" disabled={busy} type="submit">{busy ? 'Signing in…' : 'Sign in'}</button>
      </fieldset>
      <a className="admin-back" href="/">← Back to website</a>
    </form>{busy && <AdminLoading overlay label="Signing you in"/>}
  </main>;
}

export default function Admin() {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(hasSession);
  const [notice, setNotice] = useState('');
  const [section, setSection] = useState('overview');
  const [loggingOut, setLoggingOut] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const expire = useCallback(() => {
    setSession(''); setUser(null); setSection('overview'); setNotice('Your session has expired. Please sign in again.');
    window.history.replaceState(window.history.state, '', '/admin/login');
  }, []);
  useEffect(() => {
    document.title = 'Roann Sourcing Admin';
    const robots = document.createElement('meta'); robots.name = 'robots'; robots.content = 'noindex, nofollow'; document.head.appendChild(robots);
    return () => robots.remove();
  }, []);
  useEffect(() => {
    window.addEventListener('roann-admin-expired', expire);
    const controller = new AbortController();
    if (hasSession()) {
      adminRequest('admin/me', { signal: controller.signal }).then(identity => { setUser(identity); window.history.replaceState(window.history.state, '', '/admin'); })
        .catch(failure => { if (failure.name !== 'AbortError') { setSession(''); setNotice(failure.message); } })
        .finally(() => { if (!controller.signal.aborted) setChecking(false); });
    } else { window.history.replaceState(window.history.state, '', '/admin/login'); setChecking(false); }
    return () => { controller.abort(); window.removeEventListener('roann-admin-expired', expire); };
  }, [expire]);

  async function logout() {
    setLoggingOut(true);
    try { await adminRequest('auth/logout', { method: 'POST' }); setNotice('You have signed out.'); }
    catch { setNotice('Signed out of this browser. The server could not be reached to revoke the session.'); }
    finally { setSession(''); setUser(null); setSection('overview'); setLoggingOut(false); window.history.replaceState(window.history.state, '', '/admin/login'); }
  }
  const tabs = [['overview', 'Overview'], ...Object.entries(resources).map(([key, value]) => [key, value.label]), ['quotes', 'Quote requests']];

  const navIcons = {overview:LayoutDashboard,products:Package,categories:Layers3,hero_banners:Image,partners:Handshake,quotes:Inbox};
  const sectionLabel = tabs.find(([key]) => key === section)?.[1] || 'Overview';
  return <TranslationScope.Provider value={false}><div className="admin-app" lang="en">
    {checking ? <AdminLoading label="Checking your session"/> : !user ? <Login notice={notice} onLogin={identity => { setUser(identity); setNotice(''); window.history.replaceState(window.history.state, '', '/admin'); }}/>
      : <div className={`admin-shell${section === 'overview' ? ' is-overview' : section === 'products' ? ' is-products' : ''}`}>
        <aside className={`admin-sidebar${mobileMenu ? ' menu-open' : ''}`}>
          <div className="admin-sidebar-brandrow"><a className="admin-workspace-brand" href="/" aria-label="Roann Sourcing home"><AdminLogo/></a><button className="admin-mobile-toggle" aria-label={mobileMenu?'Close navigation':'Open navigation'} aria-expanded={mobileMenu} aria-controls="admin-navigation" onClick={()=>setMobileMenu(value=>!value)}>{mobileMenu?<X size={19}/>:<Menu size={19}/>}</button></div>
          <p className="admin-sidebar-label">WORKSPACE</p>
          <nav id="admin-navigation" aria-label="Admin navigation">{tabs.map(([key,label]) => { const Icon=navIcons[key]; return <button key={key} aria-current={section===key?'page':undefined} onClick={()=>{setSection(key);setMobileMenu(false);}}><Icon size={18}/><span>{label}</span>{section===key && <i/>}</button>; })}</nav>
          <div className="admin-sidebar-footer"><div className="admin-sidebar-support"><ShieldCheck size={19}/><div><strong>Your workspace is secure</strong><p>Private administrator access</p></div></div><div className="admin-sidebar-account"><span className="admin-avatar">{user.email.slice(0,1).toUpperCase()}</span><div><strong>Administrator</strong><small>{user.email}</small></div></div></div>
        </aside>
        <div className="admin-workspace"><header className="admin-topbar"><div className="admin-breadcrumb"><LayoutDashboard size={17}/><span>Workspace</span><ChevronRight size={13}/><strong>{sectionLabel}</strong></div><div className="admin-topbar-actions"><a href="/">View website<ArrowUpRight size={15}/></a><span className="admin-topbar-divider"/><span className="admin-avatar">{user.email.slice(0,1).toUpperCase()}</span><div className="admin-topbar-account"><strong>Administrator</strong><small>{user.email}</small></div><button className="admin-signout" aria-label={loggingOut?'Signing out?':'Sign out'} disabled={loggingOut} onClick={logout}><LogOut size={16}/><span>{loggingOut?'Signing out?':'Sign out'}</span></button></div></header>
          <main className="admin-content">
            <p className="admin-publishing-note"><ShieldCheck size={14}/>Saved changes appear on the public website after refreshing the page.</p>
            {section === 'overview' ? <Dashboard onSelect={setSection}/> : section === 'categories' ? <CategoryManager/> : section === 'hero_banners' ? <BannerManager/> : section === 'partners' ? <PartnerManager/> : resources[section] ? <CollectionManager key={section} resourceKey={section}/> : section === 'quotes' ? <QuoteInbox/> : null}
          </main>
        </div>
      </div>}
    <AdminExitGuard enabled={Boolean(user)}/>
  </div></TranslationScope.Provider>;
}
