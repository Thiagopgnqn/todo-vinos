import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const adminPasswordHash = await bcrypt.hash('Admin123!', 10);
  
  await prisma.user.upsert({
    where: { email: 'admin@todovinos.com' },
    update: {},
    create: {
      email: 'admin@todovinos.com',
      passwordHash: adminPasswordHash,
      name: 'Admin',
      role: 'ADMIN',
    },
  });

  const products = [
    {
      name: 'Malbec Reserva',
      description: 'Vino tinto de gran cuerpo y taninos suaves.',
      price: 8500.0,
      stock: 50,
      type: 'TINTO',
      varietal: 'Malbec',
      year: 2021,
      winery: 'Catena Zapata',
      region: 'Mendoza',
      tastingNotes: 'Notas a frutos rojos y vainilla.',
      pairing: 'Carnes rojas asadas.',
      imageUrl: '/uploads/malbec.jpg'
    },
    {
      name: 'Cabernet Sauvignon',
      description: 'Tinto intenso y estructurado.',
      price: 9200.0,
      stock: 30,
      type: 'TINTO',
      varietal: 'Cabernet Sauvignon',
      year: 2020,
      winery: 'Luigi Bosca',
      region: 'Mendoza',
      tastingNotes: 'Aromas a pimiento y especias.',
      pairing: 'Cordero y quesos duros.',
      imageUrl: '/uploads/cabernet.jpg'
    },
    {
      name: 'Chardonnay Gran Reserva',
      description: 'Blanco untuoso con paso por barrica.',
      price: 11000.0,
      stock: 25,
      type: 'BLANCO',
      varietal: 'Chardonnay',
      year: 2022,
      winery: 'Rutini',
      region: 'Valle de Uco',
      tastingNotes: 'Frutas tropicales y miel.',
      pairing: 'Pescados grasos y pastas con salsa blanca.',
      imageUrl: '/uploads/chardonnay.jpg'
    },
    {
      name: 'Torrontés de Altura',
      description: 'Blanco fresco y aromático.',
      price: 6500.0,
      stock: 40,
      type: 'BLANCO',
      varietal: 'Torrontés',
      year: 2023,
      winery: 'Colomé',
      region: 'Salta',
      tastingNotes: 'Flores blancas y cítricos.',
      pairing: 'Comida asiática y empanadas salteñas.',
      imageUrl: '/uploads/torrontes.jpg'
    },
    {
      name: 'Rosé de Malbec',
      description: 'Vino rosado ligero y refrescante.',
      price: 7200.0,
      stock: 35,
      type: 'ROSADO',
      varietal: 'Malbec',
      year: 2023,
      winery: 'Zuccardi',
      region: 'Valle de Uco',
      tastingNotes: 'Frutos rojos frescos.',
      pairing: 'Ensaladas y mariscos.',
      imageUrl: '/uploads/rose.jpg'
    },
    {
      name: 'Syrah Rosado',
      description: 'Rosado con carácter y frescura.',
      price: 6800.0,
      stock: 20,
      type: 'ROSADO',
      varietal: 'Syrah',
      year: 2022,
      winery: 'Finca Las Moras',
      region: 'San Juan',
      tastingNotes: 'Cereza y frutilla.',
      pairing: 'Picadas y pizzas.',
      imageUrl: '/uploads/syrah-rose.jpg'
    },
    {
      name: 'Extra Brut',
      description: 'Espumante elegante y equilibrado.',
      price: 12500.0,
      stock: 45,
      type: 'ESPUMANTE',
      varietal: 'Chardonnay - Pinot Noir',
      year: 2021,
      winery: 'Chandon',
      region: 'Mendoza',
      tastingNotes: 'Manzana verde y pan tostado.',
      pairing: 'Sushi y postres.',
      imageUrl: '/uploads/extrabrut.jpg'
    },
    {
      name: 'Nature',
      description: 'Espumante seco y complejo.',
      price: 15000.0,
      stock: 15,
      type: 'ESPUMANTE',
      varietal: 'Pinot Noir',
      year: 2020,
      winery: 'Cruzat',
      region: 'Luján de Cuyo',
      tastingNotes: 'Frutos secos y levadura.',
      pairing: 'Ostras y caviar.',
      imageUrl: '/uploads/nature.jpg'
    }
  ];

  for (const product of products) {
    await prisma.product.create({
      data: product
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
