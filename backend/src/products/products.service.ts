import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CategoriesService } from '../categories/categories.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FindProductsQueryDto } from './dto/find-products-query.dto';
import { ProductVariantValidator } from './validators/product-variant.validator';
import { CreateVariantDto } from './dto/create-variant.dto';
import { UpdateVariantDto } from './dto/update-variant.dto';
import { generateSlug } from './utils/slugify';
import { generateSku } from './utils/generate-sku';

const PRODUCT_INCLUDE = {
  variants: { orderBy: { position: 'asc' } },
  colorImages: true,
} as const;
type ProductWithImages = Prisma.ProductGetPayload<{
  include: typeof PRODUCT_INCLUDE;
}>;

@Injectable()
export class ProductsService {
  constructor(
    private prisma: PrismaService,
    private categoriesService: CategoriesService,
  ) {}

  private async buildWhere(
    query: FindProductsQueryDto,
  ): Promise<Prisma.ProductWhereInput> {
    const { search, categoryId, minPrice, maxPrice, ram, storage } = query;
    const where: Prisma.ProductWhereInput = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { brand: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (categoryId) {
      // Includes the category itself plus all descendant categories
      const categoryIds =
        await this.categoriesService.getCategoryAndDescendantIds(categoryId);
      where.categoryId = { in: categoryIds };
    }

    // Variant-level filters: product matches if AT LEAST ONE variant fits
    const variantConditions: Prisma.ProductVariantWhereInput[] = [];

    if (minPrice !== undefined || maxPrice !== undefined) {
      variantConditions.push({
        price: {
          ...(minPrice !== undefined ? { gte: minPrice } : {}),
          ...(maxPrice !== undefined ? { lte: maxPrice } : {}),
        },
      });
    }

    if (ram !== undefined) {
      variantConditions.push({ attributes: { path: ['ram'], equals: ram } });
    }

    if (storage !== undefined) {
      variantConditions.push({
        attributes: { path: ['storage'], equals: storage },
      });
    }

    if (variantConditions.length > 0) {
      where.variants = { some: { AND: variantConditions } };
    }

    return where;
  }

  private buildOrderBy(
    query: FindProductsQueryDto,
  ): Prisma.ProductOrderByWithRelationInput {
    const { sortBy, sortOrder } = query;

    // Product has no single price -> sort by min/max price across its variants
    if (sortBy === 'price') {
      return {
        variants: { _min: { price: sortOrder } },
      } as Prisma.ProductOrderByWithRelationInput;
    }

    return { [sortBy!]: sortOrder };
  }

  // Resolved images go to images, the raw override goes to ownImages
  private withImages(p: ProductWithImages) {
    const byColor = new Map(p.colorImages.map((c) => [c.color, c.images]));
    return {
      ...p,
      variants: p.variants.map((v) => {
        const color = (v.attributes as { color?: string }).color ?? '';
        return {
          ...v,
          ownImages: v.images,
          images: v.images.length ? v.images : (byColor.get(color) ?? []),
        };
      }),
    };
  }

  async findAll(query: FindProductsQueryDto) {
    const { page, limit } = query;
    const skip = (page! - 1) * limit!;
    const where = await this.buildWhere(query);
    const orderBy = this.buildOrderBy(query);

    // TODO: total show all variants, not products
    // NOTE: admin side also use findAll

    // Pagination counts Products, not Variants
    const [data, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: PRODUCT_INCLUDE,
      }),
      this.prisma.product.count({ where }),
    ]);

    return {
      data: data.map((p) => this.withImages(p)),
      meta: {
        total,
        page: page!,
        limit: limit!,
        totalPages: Math.ceil(total / limit!),
      },
    };
  }

  async findOne(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: PRODUCT_INCLUDE,
    });
    if (!product) throw new NotFoundException('Product not found');
    return this.withImages(product);
  }

  async findBySlug(slug: string) {
    const product = await this.prisma.product.findUnique({
      where: { slug },
      include: PRODUCT_INCLUDE,
    });
    if (!product) throw new NotFoundException('Product not found');
    return this.withImages(product);
  }

  async create(createProductDto: CreateProductDto, adminId: string) {
    const { variants, colorImages, ...productData } = createProductDto;

    // Fill in SKUs before validation/slug generation, since both depend on it
    const variantsWithSku = await Promise.all(
      variants.map(async (v) => ({
        ...v,
        sku: v.sku ?? (await generateSku(this.prisma)),
      })),
    );

    // Fail-fast: run before touching the database
    ProductVariantValidator.validateAll(
      productData.attributes,
      variantsWithSku,
    );

    // Nested write: Prisma wraps this in a single atomic SQL transaction,
    // so a product is never persisted without at least one variant
    const created = await this.prisma.product.create({
      data: {
        ...productData,
        slug: generateSlug(productData.name),
        createdById: adminId,
        variants: {
          create: variantsWithSku.map((v, position) => ({ ...v, position })),
        },
        colorImages: { create: colorImages ?? [] },
      },
      include: PRODUCT_INCLUDE,
    });
    return this.withImages(created);
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const existing = await this.prisma.product.findUnique({
      where: { id },
      include: { variants: true },
    });
    if (!existing) throw new NotFoundException('Product not found');

    const { variants, colorImages, ...productData } = updateProductDto;

    // Fill in SKUs for any new variants (no id) before validation/slug/transaction
    const variantsWithSku = variants
      ? await Promise.all(
          variants.map(async (v) => ({
            ...v,
            sku: v.sku ?? (await generateSku(this.prisma)),
          })),
        )
      : undefined;

    // Regenerate slug only if name changed, so unrelated saves keep the URL stable
    const slugUpdate =
      productData.name && productData.name !== existing.name
        ? { slug: generateSlug(productData.name) }
        : {};

    if (variantsWithSku) {
      const productAttributes =
        productData.attributes ??
        (existing.attributes as Prisma.InputJsonValue);
      ProductVariantValidator.validateAll(productAttributes, variantsWithSku);

      // Guard against deleting every variant via the sync
      const incomingIds = variantsWithSku
        .map((v) => v.id)
        .filter((vId): vId is string => vId !== undefined);
      const toDelete = existing.variants.filter(
        (v) => !incomingIds.includes(v.id),
      );
      if (
        toDelete.length === existing.variants.length &&
        variantsWithSku.length === 0
      ) {
        throw new BadRequestException(
          'Product must retain at least one variant',
        );
      }
    }

    const updated = await this.prisma.$transaction(async (tx) => {
      if (variantsWithSku) {
        const incomingIds = variantsWithSku
          .map((v) => v.id)
          .filter((vId): vId is string => vId !== undefined);

        // Delete variants that were dropped from the incoming array
        await tx.productVariant.deleteMany({
          where: { productId: id, id: { notIn: incomingIds } },
        });

        // Smart sync: has id -> update (preserves id/history), no id -> create
        for (const [position, variant] of variantsWithSku.entries()) {
          const { id: variantId, ...variantData } = variant;
          if (variantId) {
            await tx.productVariant.update({
              where: { id: variantId },
              data: { ...variantData, position },
            });
          } else {
            await tx.productVariant.create({
              data: { ...variantData, position, productId: id },
            });
          }
        }
      }

      if (colorImages) {
        await tx.productColorImages.deleteMany({
          where: {
            productId: id,
            color: { notIn: colorImages.map((c) => c.color) },
          },
        });
        for (const c of colorImages) {
          await tx.productColorImages.upsert({
            where: { productId_color: { productId: id, color: c.color } },
            update: { images: c.images },
            create: { productId: id, color: c.color, images: c.images },
          });
        }
      }

      return tx.product.update({
        where: { id },
        data: {
          ...productData,
          ...slugUpdate,
        } satisfies Prisma.ProductUpdateInput,
        include: PRODUCT_INCLUDE,
      });
    });
    return this.withImages(updated);
  }

  async remove(id: string) {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) throw new NotFoundException('Product not found');
    return this.prisma.product.delete({ where: { id } });
  }

  async addVariant(productId: string, dto: CreateVariantDto) {
    const product = await this.findOne(productId);
    const productAttributes = product.attributes as Prisma.InputJsonValue;
    const sku = dto.sku ?? (await generateSku(this.prisma));
    ProductVariantValidator.validateAll(productAttributes, [{ ...dto, sku }]);
    const position = await this.prisma.productVariant.count({
      where: { productId },
    });
    return this.prisma.productVariant.create({
      data: { ...dto, sku, productId, position },
    });
  }

  async updateVariant(
    productId: string,
    variantId: string,
    dto: UpdateVariantDto,
  ) {
    const variant = await this.prisma.productVariant.findUnique({
      where: { id: variantId },
    });
    if (!variant || variant.productId !== productId) {
      throw new NotFoundException('Variant not found on this product');
    }

    const product = await this.findOne(productId);
    const productAttributes = product.attributes as Prisma.InputJsonValue;
    const sku = dto.sku ?? variant.sku;
    ProductVariantValidator.validateAll(productAttributes, [{ ...dto, sku }]);

    return this.prisma.productVariant.update({
      where: { id: variantId },
      data: { ...dto, sku },
    });
  }

  async removeVariant(productId: string, variantId: string) {
    const variant = await this.prisma.productVariant.findUnique({
      where: { id: variantId },
    });
    if (!variant || variant.productId !== productId) {
      throw new NotFoundException('Variant not found on this product');
    }

    const variantCount = await this.prisma.productVariant.count({
      where: { productId },
    });
    if (variantCount <= 1) {
      throw new BadRequestException('Product must retain at least one variant');
    }

    return this.prisma.productVariant.delete({ where: { id: variantId } });
  }
}
