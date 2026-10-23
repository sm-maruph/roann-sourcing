import { useEffect, useState } from 'react';

export async function publicRequest(path, options = {}) {
  const response = await fetch(`/api/${path}`, {
    ...options, cache: 'no-store',
    headers: { ...(options.body ? { 'Content-Type': 'application/json' } : {}), ...options.headers },
  });
  const json = response.headers.get('content-type')?.includes('application/json');
  const data = json ? await response.json() : null;
  if (!response.ok || !json) throw new Error(data?.error || 'Unable to reach the server. Please try again.');
  return data;
}

export function usePublicData(path) {
  const [state, setState] = useState({ data: null, loading: true, error: '' });
  useEffect(() => {
    const controller = new AbortController();
    setState({ data: null, loading: true, error: '' });
    publicRequest(path, { signal: controller.signal })
      .then(data => setState({ data, loading: false, error: '' }))
      .catch(error => { if (error.name !== 'AbortError') setState({ data: null, loading: false, error: error.message }); });
    return () => controller.abort();
  }, [path]);
  return state;
}
