import { PrismaService } from '../../prisma/prisma.service';

// Random 6-digit numeric SKU, retried on collision and sku is unique
export async function generateSku(prisma: PrismaService): Promise<string> {
  for (let attempt = 0; attempt < 5; attempt++) {
    const candidate = String(Math.floor(100000 + Math.random() * 900000));
    const existing = await prisma.productVariant.findUnique({
      where: { sku: candidate },
    });
    if (!existing) return candidate;
  }
  throw new Error('Failed to generate a unique SKU, try again');
}
