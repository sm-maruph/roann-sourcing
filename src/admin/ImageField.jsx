import { useState } from 'react';
import { adminRequest } from './api';

export default function ImageField({ id, value, onChange, kind, onUploading, onUploaded, ...attributes }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  async function upload(event) {
    const file = event.target.files[0];
    event.target.value = '';
    if (!file) return;
    if (file.size > 12 * 1024 * 1024) { setError('Choose an image no larger than 12 MB.'); return; }
    setBusy(true); onUploading(true); setError('');
    const form = new FormData(); form.append('image', file); form.append('kind', kind);
    try { const asset = await adminRequest('admin/uploads', { method: 'POST', body: form }); onUploaded?.(asset.url); onChange(asset.url); }
    catch (failure) { setError(failure.message); }
    finally { setBusy(false); onUploading(false); }
  }
  return <div>
    <input id={id} value={value || ''} {...attributes} onChange={event => onChange(event.target.value)}/>
    <label>Upload image<input type="file" accept="image/jpeg,image/png,image/webp,image/avif" disabled={busy} onChange={upload}/></label>
    {busy && <p role="status">Uploading image… Wait for the preview before saving.</p>}
    {error && <p role="alert" className="admin-error">{error}</p>}
    {value && <><img src={value} alt="Selected image preview" style={{ maxWidth: '100%', width: 220, maxHeight: 180, objectFit: 'contain' }}/><button type="button" disabled={busy} onClick={() => onChange('')}>Remove image</button><small style={{display:'block'}}>Save changes to apply image removal.</small></>}
  </div>;
}
