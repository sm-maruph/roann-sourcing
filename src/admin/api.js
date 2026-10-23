import { apiUrl } from '../api/public.js';

const sessionKey = 'roann-admin-session';
let token = '';
try { token = sessionStorage.getItem(sessionKey) || ''; } catch { /* Session stays in memory if storage is disabled. */ }

export function setSession(value) {
  token = value || '';
  try {
    if (token) sessionStorage.setItem(sessionKey, token);
    else sessionStorage.removeItem(sessionKey);
  } catch { /* The in-memory session still works. */ }
}

export function hasSession() { return Boolean(token); }

export async function adminRequest(path, { method = 'GET', body, signal } = {}) {
  const isUpload = body instanceof FormData;
  let response;
  try {
    response = await fetch(apiUrl(`/api/${path}`), {
      method, signal, cache: 'no-store',
      headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}), ...(!isUpload && body ? { 'Content-Type': 'application/json' } : {}) },
      ...(body ? { body: isUpload ? body : JSON.stringify(body) } : {}),
    });
  } catch (error) {
    if (error.name === 'AbortError') throw error;
    throw new Error('Cannot reach the server. Check that the backend is running and try again.');
  }
  const type = response.headers.get('content-type') || '';
  const data = response.status === 204 ? null : type.includes('application/json') ? await response.json() : null;
  if (response.status === 401 && path !== 'auth/login') {
    setSession('');
    window.dispatchEvent(new Event('roann-admin-expired'));
  }
  if (!response.ok) throw new Error(data?.error || (response.status === 429 ? 'Too many attempts. Please try again later.' : `Request failed (${response.status}). Please try again.`));
  if (response.status !== 204 && !type.includes('application/json')) throw new Error('The API is unavailable. Check the backend connection.');
  return data;
}
import { apiUrl } from '../api/public.js';

