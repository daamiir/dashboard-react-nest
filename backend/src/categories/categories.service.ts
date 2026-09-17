import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  // Recursively collects the given category's id plus all descendant ids
  async getCategoryAndDescendantIds(categoryId: string): Promise<string[]> {
    const ids = [categoryId];
    let currentLevelIds = [categoryId];

    while (currentLevelIds.length > 0) {
      const children = await this.prisma.category.findMany({
        where: { parentId: { in: currentLevelIds } },
        select: { id: true },
      });

      if (children.length === 0) break;

      const childIds = children.map((c) => c.id);
      ids.push(...childIds);
      currentLevelIds = childIds;
    }

    return ids;
  }

  findAll() {
    // Flat list; frontend builds the tree client-side via parentId
    return this.prisma.category.findMany({ orderBy: { name: 'asc' } });
  }

  async findOne(id: string) {
    const category = await this.prisma.category.findUnique({ where: { id } });
    if (!category) throw new NotFoundException('Category not found');
    return category;
  }

  async create(dto: CreateCategoryDto) {
    if (dto.parentId) await this.findOne(dto.parentId);
    return this.prisma.category.create({ data: dto });
  }

  async update(id: string, dto: UpdateCategoryDto) {
    await this.findOne(id);

    if (dto.parentId) {
      if (dto.parentId === id) {
        throw new BadRequestException('A category cannot be its own parent');
      }
      // Block making a descendant the new parent (would create a cycle)
      const descendantIds = await this.getCategoryAndDescendantIds(id);
      if (descendantIds.includes(dto.parentId)) {
        throw new BadRequestException(
          'Cannot set a descendant category as parent',
        );
      }
    }

    return this.prisma.category.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.findOne(id);

    const childCount = await this.prisma.category.count({
      where: { parentId: id },
    });
    if (childCount > 0) {
      throw new BadRequestException(
        'Cannot delete a category that has subcategories',
      );
    }

    const productCount = await this.prisma.product.count({
      where: { categoryId: id },
    });
    if (productCount > 0) {
      throw new BadRequestException(
        'Cannot delete a category that has products',
      );
    }

    return this.prisma.category.delete({ where: { id } });
  }
}
