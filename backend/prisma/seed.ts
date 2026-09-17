import { PrismaClient, Role } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as bcrypt from 'bcrypt';

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.productVariant.deleteMany();
  await prisma.product.deleteMany();

  const passwordHash = await bcrypt.hash('Admin123!', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@demo.com' },
    update: {},
    create: {
      email: 'admin@demo.com',
      name: 'Demo Admin',
      passwordHash,
      role: Role.ADMIN,
    },
  });

  const smartphoneCategory = await prisma.category.upsert({
    where: { slug: 'smartphone' },
    update: {},
    create: { name: 'Smartphone', slug: 'smartphone' },
  });

  const product = await prisma.product.create({
    data: {
      name: 'Smartphone Apple iPhone 17 Pro',
      slug: '',
      categoryId: smartphoneCategory.id,
      brand: 'Apple',
      description:
        'Powered by the A19 Pro chip with 12GB RAM, 120Hz ProMotion screen, and upgraded 48MP lenses on all rear cameras.',
      attributes: {
        screenSize: 6.3,
        screenType: 'OLED',
        refreshRate: 120,
        processor: 'Apple A19 Pro',
        battery: 4100,
        mainCamera: 48,
        frontCamera: 24,
        os: 'iOS',
        simType: 'eSIM + Nano-SIM',
        weight: 191,
        has5G: true,
        hasNfc: true,
        eSimSupport: true,
      },
      createdById: admin.id,
      variants: {
        create: [
          {
            sku: 'APL-IP17P-12-256-DPB',
            price: 1099.99,
            stockQuantity: 35,
            images: [
              'https://images.unsplash.com/photo-1695048065057-0243e33b6643',
            ],
            attributes: { ram: 12, storage: 256, color: 'Silver' },
          },
        ],
      },
    },
  });

  console.log(
    `Seeded product "${product.name}" for admin ${admin.email} (${admin.id}).`,
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
