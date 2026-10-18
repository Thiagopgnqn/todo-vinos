import { Router } from 'express';
import { z } from 'zod';
import { sendMetaEvent } from '../services/meta.service.js';
import { metaLimiter } from '../middleware/rateLimiter.js';

const router = Router();

const schema = z.object({
  eventName: z.enum([
    'ViewContent',
    'AddToCart',
    'InitiateCheckout',
    'Purchase',
    'Contact',
    'Lead',
    'Search',
  ]),
  eventId: z.string().min(1).max(100),
  url: z.string().max(2000).optional(),
  data: z.record(z.string(), z.any()).optional(),
  user: z
    .object({
      email: z.string().max(200).optional(),
      phone: z.string().max(50).optional(),
      firstName: z.string().max(100).optional(),
      lastName: z.string().max(100).optional(),
    })
    .optional(),
  fbp: z.string().max(200).optional(),
  fbc: z.string().max(300).optional(),
});

router.post('/events', metaLimiter, (req, res) => {
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ ok: false });
  }

  // Respondemos rápido; el envío a Meta continúa en segundo plano
  res.status(202).json({ ok: true });

  sendMetaEvent({
    ...parsed.data,
    ip: req.ip,
    userAgent: req.headers['user-agent'],
  }).catch((err) => console.error('[Meta CAPI] Fallo de red', err.message));
});

export default router;

