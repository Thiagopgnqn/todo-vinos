import { z } from 'zod';

export const createProductSchema = z.object({
  name: z.string().min(2),
  description: z.string().min(10),
  price: z.number().positive(),
  transferPrice: z.number().positive().optional().nullable(),
  stock: z.number().int().nonnegative(),
  type: z.enum(['TINTO', 'BLANCO', 'ROSADO', 'ESPUMANTE']),
  varietal: z.string().min(2),
  year: z.number().int().positive(),
  winery: z.string().min(2),
  region: z.string().min(2),
  tastingNotes: z.string().optional(),
  pairing: z.string().optional(),
  imageUrl: z.string().optional()
});

export const updateProductSchema = createProductSchema.partial();
