import { useEffect, useRef } from 'react';
import { adminRequest } from './api';

// At close/save, discard temporary uploads that were never attached to saved content.
// The backend retains any URL still referenced by a saved record.
export default function useUploadCleanup() {
  const urls = useRef(new Set());
  useEffect(() => () => {
    for (const url of urls.current) {
      adminRequest('admin/uploads/remove', { method: 'POST', body: { url } }).catch(() => {});
    }
  }, []);
  return url => urls.current.add(url);
}
