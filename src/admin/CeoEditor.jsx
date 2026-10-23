import { useEffect, useState } from 'react';
import { adminRequest } from './api';

export default function CeoEditor() {
  const [values, setValues] = useState({ name: '', role: '', quote: '', image_url: '' });
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [revision, setRevision] = useState(0);
  useEffect(() => {
    const controller = new AbortController(); setLoading(true); setError('');
    adminRequest('admin/ceo', { signal: controller.signal }).then(data => { if (data) setValues(data); })
      .catch(failure => { if (failure.name !== 'AbortError') setError(failure.message); })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [revision]);
  async function save(event) {
    event.preventDefault(); setBusy(true); setError(''); setNotice('');
    try { await adminRequest('admin/ceo', { method: 'PUT', body: values }); setNotice('CEO message saved.'); }
    catch (failure) { setError(failure.message); }
    finally { setBusy(false); }
  }
  return <section><h1>CEO message</h1>{error && <p className="admin-error" role="alert">{error}<button onClick={() => setRevision(value => value + 1)}>Retry</button></p>}{notice && <p role="status" className="admin-success">{notice}</p>}{loading ? <p role="status">Loading message…</p> : <form className="admin-card" onSubmit={save}><fieldset className="admin-fields" disabled={busy}>
    {[['name', 'Name', 100], ['role', 'Role', 100], ['image_url', 'Portrait image URL', 2000]].map(([key, label, max]) => <div key={key}><label htmlFor={`ceo-${key}`}>{label}</label><input id={`ceo-${key}`} value={values[key]} required={key !== 'image_url'} maxLength={max} onChange={event => setValues({ ...values, [key]: event.target.value })}/></div>)}
    <div><label htmlFor="ceo-message">Message</label><textarea id="ceo-message" rows={8} required maxLength={4000} value={values.quote} onChange={event => setValues({ ...values, quote: event.target.value })}/></div><button type="submit" className="admin-primary" disabled={busy}>{busy ? 'Saving…' : 'Save message'}</button></fieldset></form>}</section>;
}
