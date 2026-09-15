import { PrismaClient } from '@prisma/client';
import { generateWhatsAppLink } from '../utils/whatsapp.js';

const prisma = new PrismaClient();

const MIN_ORDER_BOTTLES = 6;

export const createOrder = async (data, userId) => {
  // Business rule: minimum 6 bottles per order
  const totalBottles = data.items.reduce((sum, item) => sum + item.quantity, 0);
  if (totalBottles < MIN_ORDER_BOTTLES) {
    throw new Error(`El pedido mínimo es de ${MIN_ORDER_BOTTLES} botellas. Tenés ${totalBottles} en tu carrito.`);
  }

  return prisma.$transaction(async (tx) => {
    let total = 0;
    const itemsData = [];

    for (const item of data.items) {
      const product = await tx.product.findUnique({ where: { id: item.productId } });
      if (!product || !product.active) {
        throw new Error(`Product ${item.productId} not found or inactive`);
      }
      if (product.stock < item.quantity) {
        throw new Error(`Insufficient stock for product ${product.name}`);
      }

      const unitPrice = product.price;
      const subtotal = unitPrice * item.quantity;
      total += subtotal;

      itemsData.push({
        productId: product.id,
        quantity: item.quantity,
        unitPrice,
        subtotal
      });

      await tx.product.update({
        where: { id: product.id },
        data: {
          stock: product.stock - item.quantity,
          soldCount: product.soldCount + item.quantity
        }
      });
    }

    const order = await tx.order.create({
      data: {
        userId,
        customerName: data.customerName,
        customerPhone: data.customerPhone,
        customerEmail: data.customerEmail,
        customerAddress: data.customerAddress,
        deliveryMethod: data.deliveryMethod,
        comments: data.comments,
        total,
        items: {
          create: itemsData
        }
      },
      include: {
        items: {
          include: { product: true }
        }
      }
    });

    const whatsappLink = generateWhatsAppLink(order, order.items);
    return { order, whatsappLink };
  });
};

export const getOrders = async (filters) => {
  const { page = 1, limit = 10, status } = filters;
  const skip = (parseInt(page) - 1) * parseInt(limit);
  const take = parseInt(limit);

  const where = {};
  if (status) where.status = status;

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take,
      include: { items: { include: { product: true } } }
    }),
    prisma.order.count({ where })
  ]);

  return { orders, total, page: parseInt(page), limit: parseInt(limit) };
};

export const getOrderById = async (id) => {
  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: { include: { product: true } } }
  });
  if (!order) throw new Error('Order not found');
  return order;
};

export const updateOrderStatus = async (id, status) => {
  return prisma.$transaction(async (tx) => {
    const order = await tx.order.findUnique({
      where: { id },
      include: { items: true }
    });

    if (!order) throw new Error('Order not found');

    if (status === 'CANCELLED' && order.status !== 'CANCELLED') {
      for (const item of order.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: { increment: item.quantity },
            soldCount: { decrement: item.quantity }
          }
        });
      }
    } else if (order.status === 'CANCELLED' && status !== 'CANCELLED') {
      for (const item of order.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: { decrement: item.quantity },
            soldCount: { increment: item.quantity }
          }
        });
      }
    }

    return tx.order.update({
      where: { id },
      data: { status }
    });
  });
};
