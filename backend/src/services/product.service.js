import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getProducts = async (filters) => {
  const { page = 1, limit = 10, type, varietal, winery, region, year, minPrice, maxPrice, search, sort } = filters;
  
  const where = { active: true };

  if (type) {
    const rawTypes = type.split(',').map(t => t.trim()).filter(Boolean);
    const expandedTypes = Array.from(new Set(
      rawTypes.flatMap(t => [
        t,
        t.toUpperCase(),
        t.toLowerCase(),
        t.charAt(0).toUpperCase() + t.slice(1).toLowerCase(),
      ])
    ));
    where.type = { in: expandedTypes };
  }
  if (varietal) where.varietal = varietal;
  if (winery) where.winery = winery;
  if (region) where.region = region;
  if (year) where.year = parseInt(year);
  if (minPrice || maxPrice) {
    where.price = {};
    if (minPrice) where.price.gte = parseFloat(minPrice);
    if (maxPrice) where.price.lte = parseFloat(maxPrice);
  }
  if (search) {
    where.OR = [
      { name: { contains: search } },
      { winery: { contains: search } }
    ];
  }

  let orderBy = { createdAt: 'desc' };
  if (sort === 'price_asc') orderBy = { price: 'asc' };
  else if (sort === 'price_desc') orderBy = { price: 'desc' };
  else if (sort === 'best_selling') orderBy = { soldCount: 'desc' };
  else if (sort === 'newest') orderBy = { createdAt: 'desc' };

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const take = parseInt(limit);

  const [products, total] = await Promise.all([
    prisma.product.findMany({ where, orderBy, skip, take }),
    prisma.product.count({ where })
  ]);

  return { products, total, page: parseInt(page), limit: parseInt(limit) };
};

export const getProductById = async (id) => {
  const product = await prisma.product.findFirst({
    where: { id, active: true }
  });
  if (!product) throw new Error('Product not found');
  return product;
};

export const createProduct = async (data) => {
  return prisma.product.create({ data });
};

export const updateProduct = async (id, data) => {
  return prisma.product.update({
    where: { id },
    data
  });
};

export const deleteProduct = async (id) => {
  return prisma.product.update({
    where: { id },
    data: { active: false }
  });
};
