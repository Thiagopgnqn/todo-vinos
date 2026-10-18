import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { trackPageView } from '../lib/meta';

export default function MetaPixelTracker() {
  const { pathname, search } = useLocation();

  useEffect(() => {
    if (pathname.startsWith('/admin')) return; // no medir el panel de administración
    trackPageView();
  }, [pathname, search]);

  return null;
}

