import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const rawProducts = [
  {
    name: 'ASUS ROG Gaming Laptop',
    category: 'Laptop',
    brand: 'ASUS',
    price: 2199,
    stock: 'Out of Stock',
    createdAt: '2027-12-01',
  },
  {
    name: 'Airpods Pro 2nd Gen',
    category: 'Accessories',
    brand: 'Apple',
    price: 839,
    stock: 'In Stock',
    createdAt: '2027-06-29',
  },
  {
    name: 'Apple Watch Ultra',
    category: 'Watch',
    brand: 'Apple',
    price: 1579,
    stock: 'Out of Stock',
    createdAt: '2027-03-13',
  },
  {
    name: 'Bose QuietComfort Earbuds',
    category: 'Audio',
    brand: 'Bose',
    price: 279,
    stock: 'In Stock',
    createdAt: '2027-11-18',
  },
  {
    name: 'Canon EOS R5 Camera',
    category: 'Camera',
    brand: 'Canon',
    price: 3899,
    stock: 'In Stock',
    createdAt: '2027-09-28',
  },
  {
    name: 'Dell XPS 13 Laptop',
    category: 'Laptop',
    brand: 'Dell',
    price: 1299,
    stock: 'In Stock',
    createdAt: '2027-08-18',
  },
  {
    name: 'Google Pixel 8 Pro',
    category: 'Phone',
    brand: 'Google',
    price: 899,
    stock: 'Out of Stock',
    createdAt: '2027-09-02',
  },
  {
    name: 'Samsung Galaxy S24 Ultra',
    category: 'Phone',
    brand: 'Samsung',
    price: 1199,
    stock: 'In Stock',
    createdAt: '2027-07-14',
  },
  {
    name: 'Sony WH-1000XM5',
    category: 'Audio',
    brand: 'Sony',
    price: 399,
    stock: 'In Stock',
    createdAt: '2027-05-22',
  },
  {
    name: 'MacBook Pro 14\u201d',
    category: 'Laptop',
    brand: 'Apple',
    price: 2499,
    stock: 'Out of Stock',
    createdAt: '2027-04-11',
  },
  {
    name: 'Nikon Z6 III Camera',
    category: 'Camera',
    brand: 'Nikon',
    price: 2499,
    stock: 'In Stock',
    createdAt: '2027-02-19',
  },
  {
    name: 'Garmin Fenix 7',
    category: 'Watch',
    brand: 'Garmin',
    price: 699,
    stock: 'In Stock',
    createdAt: '2027-01-30',
  },
  {
    name: 'Logitech MX Master 3S',
    category: 'Accessories',
    brand: 'Logitech',
    price: 99,
    stock: 'In Stock',
    createdAt: '2027-10-05',
  },
  {
    name: 'iPad Pro 12.9\u201d',
    category: 'Tablet',
    brand: 'Apple',
    price: 1099,
    stock: 'Out of Stock',
    createdAt: '2027-06-08',
  },
  {
    name: 'Microsoft Surface Pro 10',
    category: 'Tablet',
    brand: 'Microsoft',
    price: 1399,
    stock: 'In Stock',
    createdAt: '2027-03-27',
  },
  {
    name: 'JBL Charge 5',
    category: 'Audio',
    brand: 'JBL',
    price: 179,
    stock: 'In Stock',
    createdAt: '2026-12-15',
  },
  {
    name: 'OnePlus 12',
    category: 'Phone',
    brand: 'OnePlus',
    price: 799,
    stock: 'In Stock',
    createdAt: '2026-11-21',
  },
  {
    name: 'Lenovo Legion 5 Pro',
    category: 'Laptop',
    brand: 'Lenovo',
    price: 1599,
    stock: 'Out of Stock',
    createdAt: '2026-10-09',
  },
  {
    name: 'Fitbit Sense 2',
    category: 'Watch',
    brand: 'Fitbit',
    price: 249,
    stock: 'In Stock',
    createdAt: '2026-09-17',
  },
  {
    name: 'GoPro Hero 12',
    category: 'Camera',
    brand: 'GoPro',
    price: 399,
    stock: 'In Stock',
    createdAt: '2026-08-25',
  },
];

function quantityFor(stock: string) {
  if (stock === 'Out of Stock') return 0;
  return Math.floor(Math.random() * 80) + 10;
}

async function main() {
  await prisma.product.deleteMany();
  for (const p of rawProducts) {
    await prisma.product.create({
      data: {
        name: p.name,
        category: p.category,
        brand: p.brand,
        price: p.price,
        stockQuantity: quantityFor(p.stock),
        createdAt: new Date(p.createdAt),
      },
    });
  }
  console.log(`Seeded ${rawProducts.length} products.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => await prisma.$disconnect());
