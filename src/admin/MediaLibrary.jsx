import { useEffect, useState } from 'react';
import { adminRequest } from './api';

export default function MediaLibrary() {
  const [assets, setAssets] = useState([]);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [revision, setRevision] = useState(0);
  useEffect(() => {
    const controller = new AbortController(); setLoading(true); setError('');
    adminRequest('admin/media', { signal: controller.signal }).then(setAssets)
      .catch(failure => { if (failure.name !== 'AbortError') setError(failure.message); })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [revision]);
  async function upload(event) {
    event.preventDefault(); const form = event.currentTarget; const file = form.elements.image.files[0];
    if (!file || file.size > 12 * 1024 * 1024) { setError('Choose an image no larger than 12 MB.'); return; }
    setBusy(true); setError(''); setNotice('');
    try { await adminRequest('admin/uploads', { method: 'POST', body: new FormData(form) }); form.reset(); setNotice('Image uploaded. Copy its URL into an image field.'); setRevision(value => value + 1); }
    catch (failure) { setError(failure.message); }
    finally { setBusy(false); }
  }
  return <section><h1>Media library</h1><p>Upload JPEG, PNG, WebP or AVIF images. The server creates a resized WebP image.</p>
    <form className="admin-card" onSubmit={upload}><fieldset className="admin-fields" disabled={busy}><div><label htmlFor="upload-kind">Image type</label><select id="upload-kind" name="kind">{['product', 'hero', 'category', 'logo'].map(kind => <option key={kind} value={kind}>{kind}</option>)}</select></div><label>Image (up to 12 MB)<input name="image" type="file" accept="image/jpeg,image/png,image/webp,image/avif" required/></label><button className="admin-primary" disabled={busy} type="submit">{busy ? 'Uploading…' : 'Upload image'}</button></fieldset></form>
    {error && <p className="admin-error" role="alert">{error}<button onClick={() => setRevision(value => value + 1)}>Retry</button></p>}{notice && <p className="admin-success" role="status">{notice}</p>}
    {loading ? <p role="status">Loading images…</p> : <div className="admin-media-grid">{assets.map(asset => <article key={asset.id} className="admin-card"><img src={asset.url} alt={`${asset.kind} upload`} loading="lazy"/><p>{asset.kind} · {asset.width} × {asset.height}</p><label>Image URL<input readOnly value={asset.url} onFocus={event => event.target.select()}/></label></article>)}{!assets.length && <p>No images uploaded yet.</p>}</div>}
  </section>;
}
