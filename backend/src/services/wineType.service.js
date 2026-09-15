import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const DEFAULT_TYPES = ['Tinto', 'Blanco', 'Rosado', 'Espumante'];

export const getWineTypes = async () => {
  let types = await prisma.wineType.findMany({
    orderBy: { name: 'asc' },
  });

  // Auto-seed default types if table is empty
  if (types.length === 0) {
    for (const name of DEFAULT_TYPES) {
      await prisma.wineType.upsert({
        where: { name },
        update: {},
        create: { name },
      });
    }
    types = await prisma.wineType.findMany({
      orderBy: { name: 'asc' },
    });
  }

  // Count active products for each type
  const typesWithCount = await Promise.all(
    types.map(async (t) => {
      const productCount = await prisma.product.count({
        where: {
          active: true,
          OR: [
            { type: t.name },
            { type: t.name.toUpperCase() },
            { type: t.name.toLowerCase() },
          ],
        },
      });
      return {
        ...t,
        productCount,
      };
    })
  );

  return typesWithCount;
};

export const createWineType = async (name) => {
  const trimmed = name.trim();
  
  // Check if already exists (case-insensitive)
  const existing = await prisma.wineType.findFirst({
    where: {
      name: {
        equals: trimmed,
        mode: 'insensitive',
      },
    },
  });

  if (existing) {
    throw new Error(`El tipo de vino "${trimmed}" ya existe.`);
  }

  return prisma.wineType.create({
    data: { name: trimmed },
  });
};

export const deleteWineType = async (id) => {
  const wineType = await prisma.wineType.findUnique({
    where: { id },
  });

  if (!wineType) {
    throw new Error('Tipo de vino no encontrado.');
  }

  // Check if any active products are using this type
  const associatedProducts = await prisma.product.count({
    where: {
      active: true,
      OR: [
        { type: wineType.name },
        { type: wineType.name.toUpperCase() },
        { type: wineType.name.toLowerCase() },
      ],
    },
  });

  if (associatedProducts > 0) {
    throw new Error(
      `No se puede eliminar "${wineType.name}" porque hay ${associatedProducts} producto(s) activo(s) asignado(s) a este tipo.`
    );
  }

  return prisma.wineType.delete({
    where: { id },
  });
};

