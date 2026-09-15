import { z } from 'zod';

export const MIN_ORDER_BOTTLES = 6;

export const createOrderSchema = z.object({
  customerName: z.string().min(2),
  customerPhone: z.string().min(6),
  customerEmail: z.string().email(),
  customerAddress: z.string().optional(),
  deliveryMethod: z.enum(['PICKUP', 'DELIVERY']),
  comments: z.string().optional(),
  items: z.array(z.object({
    productId: z.string(),
    quantity: z.number().int().positive()
  })).min(1)
}).refine(
  (data) => data.items.reduce((sum, item) => sum + item.quantity, 0) >= MIN_ORDER_BOTTLES,
  { message: `El pedido mínimo es de ${MIN_ORDER_BOTTLES} botellas`, path: ['items'] }
);

export const updateOrderStatusSchema = z.object({
  status: z.enum(['PENDING', 'CONFIRMED', 'DELIVERED', 'CANCELLED'])
});
