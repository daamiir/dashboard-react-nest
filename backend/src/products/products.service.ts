import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FindProductsQueryDto } from './dto/find-products-query.dto';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  private buildWhere(query: FindProductsQueryDto): Prisma.ProductWhereInput {
    const { search, category, minPrice, maxPrice, ram, storage } = query;

    const where: Prisma.ProductWhereInput = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { brand: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (category) {
      where.category = category;
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {
        ...(minPrice !== undefined ? { gte: minPrice } : {}),
        ...(maxPrice !== undefined ? { lte: maxPrice } : {}),
      };
    }

    const specFilters: Record<string, unknown> = {};
    if (ram !== undefined) specFilters.ram = ram;
    if (storage !== undefined) specFilters.storage = storage;

    if (Object.keys(specFilters).length > 0) {
      where.AND = Object.entries(specFilters).map(([key, value]) => ({
        attributes: { path: [key], equals: value },
      })) as Prisma.ProductWhereInput['AND'];
    }

    return where;
  }

  async findAll(query: FindProductsQueryDto) {
    const { sortBy, sortOrder, page, limit } = query;
    const skip = (page! - 1) * limit!;
    const where = this.buildWhere(query);

    const [data, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        orderBy: { [sortBy!]: sortOrder },
        skip,
        take: limit,
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

  async findMyProducts(query: FindProductsQueryDto, sellerId: string) {
    const { sortBy, sortOrder, page, limit } = query;
    const skip = (page! - 1) * limit!;
    const where: Prisma.ProductWhereInput = {
      ...this.buildWhere(query),
      sellerId,
    };

    const [data, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        orderBy: { [sortBy!]: sortOrder },
        skip,
        take: limit,
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
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  create(sellerId: string, createProductDto: CreateProductDto) {
    return this.prisma.product.create({
      data: { ...createProductDto, sellerId },
    });
  }

  async update(
    id: string,
    sellerId: string,
    updateProductDto: UpdateProductDto,
  ) {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) throw new NotFoundException('Product not found');
    if (product.sellerId !== sellerId)
      throw new ForbiddenException('You are not the owner of this product');
    return this.prisma.product.update({
      where: { id },
      data: updateProductDto,
    });
  }

  async remove(id: string, sellerId: string) {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) throw new NotFoundException('Product not found');
    if (product.sellerId !== sellerId)
      throw new ForbiddenException('You are not the owner of this product');
    return this.prisma.product.delete({ where: { id } });
  }
}
