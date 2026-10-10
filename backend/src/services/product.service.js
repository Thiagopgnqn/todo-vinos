import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getProducts = async (filters) => {
  const { page = 1, limit = 9, type, varietal, winery, region, year, minPrice, maxPrice, search, sort } = filters;
  
  const where = { active: true };

  // Collect all AND conditions for filters that need OR sub-queries
  const andConditions = [];

  if (type) {
    const rawTypes = type.split(',').map(t => t.trim()).filter(Boolean);
    const typeConditions = rawTypes.map(t => ({
      OR: [
        { type: { contains: t, mode: 'insensitive' } },
        { name: { contains: t, mode: 'insensitive' } },
      ]
    }));
    andConditions.push({ OR: typeConditions });
  }

  if (varietal) {
    const varietals = varietal.split(',').map(v => v.trim()).filter(Boolean);
    const varietalConditions = varietals.map(v => ({
      OR: [
        { varietal: { contains: v, mode: 'insensitive' } },
        { name: { contains: v, mode: 'insensitive' } },
      ]
    }));
    andConditions.push({ OR: varietalConditions });
  }

  if (winery) {
    andConditions.push({
      OR: [
        { winery: { contains: winery, mode: 'insensitive' } },
        { name: { contains: winery, mode: 'insensitive' } },
      ]
    });
  }

  if (region) {
    andConditions.push({
      OR: [
        { region: { contains: region, mode: 'insensitive' } },
        { name: { contains: region, mode: 'insensitive' } },
      ]
    });
  }

  if (year) where.year = parseInt(year);
  if (minPrice || maxPrice) {
    where.price = {};
    if (minPrice) where.price.gte = parseFloat(minPrice);
    if (maxPrice) where.price.lte = parseFloat(maxPrice);
  }
  if (search) {
    andConditions.push({
      OR: [
        { name: { contains: search, mode: 'insensitive' } },
        { winery: { contains: search, mode: 'insensitive' } },
        { varietal: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ]
    });
  }

  // Combine all AND conditions
  if (andConditions.length > 0) {
    where.AND = andConditions;
  }

  let orderBy = { createdAt: 'desc' };
  if (sort === 'price_asc') orderBy = { price: 'asc' };
  else if (sort === 'price_desc') orderBy = { price: 'desc' };
  else if (sort === 'best_selling') orderBy = { soldCount: 'desc' };
  else if (sort === 'newest') orderBy = { createdAt: 'desc' };

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const take = parseInt(limit);

  const whereInStock = { ...where, stock: { gt: 0 } };
  const whereOutOfStock = { ...where, NOT: { stock: { gt: 0 } } };

  const [inStockCount, outOfStockCount] = await Promise.all([
    prisma.product.count({ where: whereInStock }),
    prisma.product.count({ where: whereOutOfStock }),
  ]);

  const total = inStockCount + outOfStockCount;

  let products = [];

  if (total > 0 && take > 0) {
    if (skip + take <= inStockCount) {
      // Entire page is within in-stock products
      products = await prisma.product.findMany({
        where: whereInStock,
        orderBy,
        skip,
        take,
      });
    } else if (skip >= inStockCount) {
      // Entire page is within out-of-stock products
      const outOfStockSkip = skip - inStockCount;
      products = await prisma.product.findMany({
        where: whereOutOfStock,
        orderBy,
        skip: outOfStockSkip,
        take,
      });
    } else {
      // Page spans the boundary (ends with in-stock, begins out-of-stock)
      const inStockTake = inStockCount - skip;
      const outOfStockTake = take - inStockTake;
      const [inStockItems, outOfStockItems] = await Promise.all([
        prisma.product.findMany({
          where: whereInStock,
          orderBy,
          skip,
          take: inStockTake,
        }),
        prisma.product.findMany({
          where: whereOutOfStock,
          orderBy,
          skip: 0,
          take: outOfStockTake,
        }),
      ]);
      products = [...inStockItems, ...outOfStockItems];
    }
  }

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
