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
        variants: {
          _min: sortOrder === 'asc' ? { price: 'asc' } : undefined,
          _max: sortOrder === 'desc' ? { price: 'desc' } : undefined,
        },
      } as Prisma.ProductOrderByWithRelationInput;
    }

    return { [sortBy!]: sortOrder };
  }

  async findAll(query: FindProductsQueryDto) {
    const { page, limit } = query;
    const skip = (page! - 1) * limit!;
    const where = await this.buildWhere(query);
    const orderBy = this.buildOrderBy(query);

    // Pagination counts Products, not Variants
    const [data, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: { variants: true },
      }),
      this.prisma.product.count({ where }),
    ]);

    return {
      data,
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
      include: { variants: true },
    });
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  create(createProductDto: CreateProductDto, adminId: string) {
    const { variants, ...productData } = createProductDto;

    // Fail-fast: run before touching the database
    ProductVariantValidator.validateAll(productData.attributes, variants);

    // Nested write: Prisma wraps this in a single atomic SQL transaction,
    // so a product is never persisted without at least one variant
    return this.prisma.product.create({
      data: {
        ...productData,
        createdById: adminId,
        variants: { create: variants },
      },
      include: { variants: true },
    });
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const existing = await this.prisma.product.findUnique({
      where: { id },
      include: { variants: true },
    });
    if (!existing) throw new NotFoundException('Product not found');

    const { variants, ...productData } = updateProductDto;

    if (variants) {
      const productAttributes =
        productData.attributes ??
        (existing.attributes as Prisma.InputJsonValue);
      ProductVariantValidator.validateAll(productAttributes, variants);

      // Guard against deleting every variant via the sync
      const incomingIds = variants
        .map((v) => v.id)
        .filter((vId): vId is string => vId !== undefined);
      const toDelete = existing.variants.filter(
        (v) => !incomingIds.includes(v.id),
      );
      if (
        toDelete.length === existing.variants.length &&
        variants.length === 0
      ) {
        throw new BadRequestException(
          'Product must retain at least one variant',
        );
      }
    }

    return this.prisma.$transaction(async (tx) => {
      if (variants) {
        const incomingIds = variants
          .map((v) => v.id)
          .filter((vId): vId is string => vId !== undefined);

        // Delete variants that were dropped from the incoming array
        await tx.productVariant.deleteMany({
          where: { productId: id, id: { notIn: incomingIds } },
        });

        // Smart sync: has id -> update (preserves id/history), no id -> create
        for (const variant of variants) {
          const { id: variantId, ...variantData } = variant;
          if (variantId) {
            await tx.productVariant.update({
              where: { id: variantId },
              data: variantData,
            });
          } else {
            await tx.productVariant.create({
              data: { ...variantData, productId: id },
            });
          }
        }
      }

      return tx.product.update({
        where: { id },
        data: productData satisfies Prisma.ProductUpdateInput,
        include: { variants: true },
      });
    });
  }

  async remove(id: string) {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) throw new NotFoundException('Product not found');
    return this.prisma.product.delete({ where: { id } });
  }
}
