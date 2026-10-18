/**
 * Integración Meta Pixel (navegador) + API de Conversiones (vía backend).
 * Todo es "best effort": si falta configuración o algo falla, nunca rompe la UI.
 */

const PIXEL_ID = import.meta.env.VITE_META_PIXEL_ID;

// Mismo criterio que api/client.js (VITE_API_URL || '/api').
// Tolera que VITE_API_URL termine o no en /api. Sin variable -> ruta relativa (proxy de Vite en dev).
const API_BASE = (import.meta.env.VITE_API_URL || '')
  .replace(/\/$/, '')
  .replace(/\/api$/, '');

const CURRENCY = 'ARS';

const getCookie = (name) => {
  try {
    return document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`))?.[1];
  } catch {
    return undefined;
  }
};

const generateId = () => {
  try {
    if (window.crypto?.randomUUID) return window.crypto.randomUUID();
  } catch {
    // randomUUID solo existe en contextos seguros (https / localhost)
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
};

const isAdminRoute = () => {
  try {
    return window.location.pathname.startsWith('/admin');
  } catch {
    return false;
  }
};

/** Carga el script del píxel. Llamar una sola vez al iniciar la app. */
export function initMetaPixel() {
  try {
    if (!PIXEL_ID || window.fbq) return;

    /* eslint-disable */
    !(function (f, b, e, v, n, t, s) {
      if (f.fbq) return;
      n = f.fbq = function () {
        n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
      };
      if (!f._fbq) f._fbq = n;
      n.push = n;
      n.loaded = !0;
      n.version = '2.0';
      n.queue = [];
      t = b.createElement(e);
      t.async = !0;
      t.src = v;
      s = b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t, s);
    })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
    /* eslint-enable */

    window.fbq('init', PIXEL_ID);
  } catch {
    // El tracking nunca debe romper la UI
  }
}

/** PageView (solo navegador). Se llama en cada cambio de ruta. */
export function trackPageView() {
  try {
    if (isAdminRoute()) return;
    window.fbq?.('track', 'PageView');
  } catch {
    // noop
  }
}

/**
 * Evento estándar: se envía al píxel (navegador) y a la API de Conversiones (backend)
 * con el mismo event_id para que Meta lo deduplique.
 *
 * @param {string} eventName  ViewContent | AddToCart | InitiateCheckout | Purchase | Contact | Lead
 * @param {object} data       custom_data (value, currency, content_ids, etc.)
 * @param {object} options    { eventId, user: { email, phone, firstName, lastName } }
 */
export function trackMeta(eventName, data = {}, { eventId, user } = {}) {
  try {
    if (isAdminRoute()) return;

    const id = eventId || generateId();

    window.fbq?.('track', eventName, data, { eventID: id });

    // Limpia campos vacíos del usuario para no enviar strings vacíos
    const cleanUser = user
      ? Object.fromEntries(Object.entries(user).filter(([, v]) => v && String(v).trim()))
      : undefined;

    fetch(`${API_BASE}/api/meta/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      keepalive: true, // sigue funcionando aunque el usuario salga hacia WhatsApp
      body: JSON.stringify({
        eventName,
        eventId: id,
        url: window.location.href,
        data,
        user: cleanUser && Object.keys(cleanUser).length ? cleanUser : undefined,
        fbp: getCookie('_fbp'),
        fbc: getCookie('_fbc'),
      }),
    }).catch(() => {});
  } catch {
    // El tracking nunca debe romper la UI
  }
}

/**
 * Arma content_ids / contents / num_items a partir de los ítems del carrito.
 * Forma real de los ítems en CartContext: { product, quantity }.
 * Se usa product.price, que es el precio con el que el backend calcula el total del pedido.
 */
export function buildContents(items = []) {
  const contents = (items || []).map((i) => {
    const p = i.product || i;
    return {
      id: String(p.id || p._id),
      quantity: Number(i.quantity) || 1,
      item_price: Number(p.price) || 0,
    };
  });

  return {
    content_type: 'product',
    content_ids: contents.map((c) => c.id),
    contents,
    num_items: contents.reduce((sum, c) => sum + c.quantity, 0),
  };
}

export { CURRENCY as META_CURRENCY };

