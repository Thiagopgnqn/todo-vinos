import crypto from 'crypto';
import { env } from '../config/env.js'; // asegura que dotenv ya cargó las variables

const sha256 = (value) =>
  crypto.createHash('sha256').update(String(value)).digest('hex');

const clean = (v) => (v ? String(v).trim().toLowerCase() : null);
const cleanPhone = (v) => (v ? String(v).replace(/\D/g, '') : null);

function buildUserData({ user = {}, ip, userAgent, fbp, fbc }) {
  const ud = {};
  const em = clean(user.email);
  const ph = cleanPhone(user.phone);
  const fn = clean(user.firstName);
  const ln = clean(user.lastName);

  if (em) ud.em = [sha256(em)];
  if (ph) ud.ph = [sha256(ph)];
  if (fn) ud.fn = [sha256(fn)];
  if (ln) ud.ln = [sha256(ln)];
  ud.country = [sha256('ar')];
  if (ip) ud.client_ip_address = ip;
  if (userAgent) ud.client_user_agent = userAgent;
  if (fbp) ud.fbp = fbp;
  if (fbc) ud.fbc = fbc;
  return ud;
}

export async function sendMetaEvent({
  eventName,
  eventId,
  url,
  data = {},
  user,
  ip,
  userAgent,
  fbp,
  fbc,
}) {
  const pixelId = process.env.META_PIXEL_ID || env.META_PIXEL_ID;
  const token = process.env.META_ACCESS_TOKEN || env.META_ACCESS_TOKEN;
  const version = process.env.META_API_VERSION || env.META_API_VERSION || 'v23.0';
  const testCode = process.env.META_TEST_EVENT_CODE || env.META_TEST_EVENT_CODE;

  if (!pixelId || !token) {
    console.warn('[Meta CAPI] Falta META_PIXEL_ID o META_ACCESS_TOKEN, evento omitido');
    return;
  }

  const payload = {
    data: [
      {
        event_name: eventName,
        event_time: Math.floor(Date.now() / 1000),
        event_id: eventId,
        action_source: 'website',
        event_source_url: url,
        user_data: buildUserData({ user, ip, userAgent, fbp, fbc }),
        custom_data: data,
      },
    ],
  };

  // Solo para probar en "Probar eventos" de Meta. Se elimina de las variables al terminar de probar.
  if (testCode) payload.test_event_code = testCode;

  const res = await fetch(
    `https://graph.facebook.com/${version}/${pixelId}/events?access_token=${encodeURIComponent(token)}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }
  );

  if (!res.ok) {
    const body = await res.text();
    console.error('[Meta CAPI] Error', res.status, body);
  }
}

