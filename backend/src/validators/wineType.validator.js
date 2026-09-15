import { z } from 'zod';

export const createWineTypeSchema = z.object({
  name: z.string().trim().min(2, 'El nombre debe tener al menos 2 caracteres').max(50, 'El nombre no puede superar los 50 caracteres'),
});

