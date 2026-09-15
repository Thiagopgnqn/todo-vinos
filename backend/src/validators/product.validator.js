import { z } from 'zod';

export const createProductSchema = z.object({
  name: z.string().trim().min(1, 'El nombre es obligatorio'),
  price: z.number({ required_error: 'El precio es obligatorio' }).positive('El precio debe ser mayor a 0'),
  type: z.string().trim().min(1, 'El tipo de vino es obligatorio'),
  imageUrl: z.string({ required_error: 'La foto del producto es obligatoria' }).trim().min(1, 'La foto del producto es obligatoria'),
  description: z.string().optional().nullable().default(''),
  transferPrice: z.number().positive().optional().nullable(),
  stock: z.number().int().nonnegative().optional().default(0),
  varietal: z.string().optional().nullable().default(''),
  year: z.number().int().positive().optional().nullable(),
  winery: z.string().optional().nullable().default(''),
  region: z.string().optional().nullable().default(''),
  tastingNotes: z.string().optional().nullable(),
  pairing: z.string().optional().nullable(),
});

export const updateProductSchema = createProductSchema.partial();
