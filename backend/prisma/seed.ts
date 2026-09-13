import { PrismaClient, Role } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as bcrypt from 'bcrypt';
import smartphones from './smartphones.data';

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.product.deleteMany();

  const passwordHash = await bcrypt.hash('Seller123!', 10);

  const seller = await prisma.user.upsert({
    where: { email: 'seller@demo.com' },
    update: {},
    create: {
      email: 'seller@demo.com',
      name: 'Demo Seller',
      passwordHash,
      role: Role.SELLER,
    },
  });

  const productData = smartphones.map((p) => ({
    name: p.name,
    category: p.category,
    brand: p.brand,
    price: p.price,
    stockQuantity: p.stockQuantity,
    images: p.images,
    description: p.description,
    ram: p.ram,
    storage: p.storage,
    screenSize: p.screenSize,
    processor: p.processor,
    color: p.color,
    os: p.os,
    releaseYear: p.releaseYear,
    has5G: p.has5G,
    hasNfc: p.hasNfc,
    attributes: p.attributes ?? {},
    sellerId: seller.id,
  }));

  const result = await prisma.product.createMany({
    data: productData,
    skipDuplicates: true,
  });

  console.log(
    `Seeded ${result.count} products for seller ${seller.email} (${seller.id}).`,
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
