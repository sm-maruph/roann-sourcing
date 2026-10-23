import { useEffect, useRef, useState } from 'react';
import { ArrowDown, ArrowUp, X } from 'lucide-react';
import { adminRequest } from './api';
import useUploadCleanup from './useUploadCleanup';

export default function HomeSlidesEditor({ banners, onClose, onSaved }) {
  const trackUpload = useUploadCleanup();
  const [slides, setSlides] = useState(() => banners.filter(row => row.page === 'home')
    .sort((a, b) => a.sort_order - b.sort_order || a.id.localeCompare(b.id))
    .map(row => ({ id: row.id, key: row.id, image_url: row.image_url, is_active: row.is_active })));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [progress, setProgress] = useState('');
  const dialog = useRef(null);
  useEffect(() => { dialog.current.showModal(); }, []);

  async function upload(event) {
    const files = Array.from(event.target.files);
    event.target.value = '';
    if (!files.length) return;
    if (slides.length + files.length > 30) { setError('You can have up to 30 homepage slides. Remove a slide or select fewer images.'); return; }
    if (files.some(file => file.size > 12 * 1024 * 1024)) { setError('Each image must be 12 MB or smaller.'); return; }
    setBusy(true); setError('');
    const failures = [];
    for (const [index, file] of files.entries()) {
      setProgress(`Uploading image ${index + 1} of ${files.length}…`);
      const form = new FormData(); form.append('image', file); form.append('kind', 'hero');
      try {
        const asset = await adminRequest('admin/uploads', { method: 'POST', body: form });
        trackUpload(asset.url);
        setSlides(previous => [...previous, { key: crypto.randomUUID(), image_url: asset.url, is_active: true }]);
      } catch { failures.push(file.name); }
    }
    if (failures.length) setError(`Could not upload: ${failures.join(', ')}. Other successful uploads are shown below. You can select the failed images again.`);
    setProgress(''); setBusy(false);
  }
  function move(index, offset) {
    setSlides(previous => {
      const next = [...previous];
      [next[index], next[index + offset]] = [next[index + offset], next[index]];
      return next;
    });
  }
  async function save(event) {
    event.preventDefault(); if (busy) return;
    setBusy(true); setError('');
    try {
      await adminRequest('admin/home-slides', { method: 'PUT', body: { slides: slides.map(({ id, image_url, is_active }) => ({ ...(id ? { id } : {}), image_url, is_active })) } });
      onSaved();
    } catch (failure) { setError(failure.message); setBusy(false); }
  }
  return <dialog className="admin-editor home-slides-editor" ref={dialog} aria-labelledby="home-slides-title" onClose={onClose} onCancel={event => { if (busy) event.preventDefault(); }}><form onSubmit={save}>
    <div className="admin-editor-heading"><h2 id="home-slides-title">Homepage hero slider</h2><button type="button" aria-label="Close slider editor" disabled={busy} onClick={onClose}><X size={18}/></button></div>
    <p>Select multiple images together. They will appear only in the homepage hero slider. Arrange them below, then save. Removed images are deleted from Storage after saving when no other content uses them.</p>
    {error && <p className="admin-error" role="alert">{error}</p>}
    <fieldset disabled={busy} className="admin-fields">
      <label>Select homepage images<input type="file" multiple accept="image/jpeg,image/png,image/webp,image/avif" onChange={upload}/></label>
      <p className="home-slides-help">Choose several files at once, or add more later. Up to 30 images, 12 MB each.</p>
      <div className="home-slides-list">{slides.map((slide, index) => <article className="home-slide-row" key={slide.key}>
        <img src={slide.image_url} alt={`Homepage slide ${index + 1} preview`}/>
        <div><strong>Slide {index + 1}</strong><label className="admin-check"><input type="checkbox" checked={slide.is_active} onChange={event => setSlides(previous => previous.map(item => item.key === slide.key ? { ...item, is_active: event.target.checked } : item))}/>Visible</label></div>
        <div className="home-slide-actions"><button type="button" disabled={busy || index === 0} aria-label={`Move slide ${index + 1} up`} onClick={() => move(index, -1)}><ArrowUp size={16}/></button><button type="button" disabled={busy || index === slides.length - 1} aria-label={`Move slide ${index + 1} down`} onClick={() => move(index, 1)}><ArrowDown size={16}/></button><button type="button" aria-label={`Remove slide ${index + 1}`} onClick={() => setSlides(previous => previous.filter(item => item.key !== slide.key))}><X size={16}/></button></div>
      </article>)}</div>
      {!slides.length && <p>No slides selected. Add images above. Saving an empty list restores the homepage’s default image.</p>}
    </fieldset>
    {progress && <p role="status">{progress}</p>}
    <div className="admin-editor-actions"><button type="button" disabled={busy} onClick={onClose}>Cancel</button><button className="admin-primary" disabled={busy} type="submit">{busy ? 'Please wait…' : 'Save homepage slider'}</button></div>
  </form></dialog>;
}
