import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

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
}
