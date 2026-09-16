import { BadRequestException } from '@nestjs/common';
import { Prisma } from '@prisma/client';

type VariantLike = { sku: string; attributes: Prisma.InputJsonValue };

// Safe Object.keys: attributes is validated as an object by class-validator,
// but the JSON type also allows arrays/primitives, so guard at runtime
function keysOf(value: Prisma.InputJsonValue): string[] {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
    ? Object.keys(value)
    : [];
}

// Fails early with 400 Bad Request to avoid raw Prisma DB errors.
export class ProductVariantValidator {
  static validateNoDuplicateSkus(variants: VariantLike[]): void {
    const skus = variants.map((v) => v.sku);
    const uniqueSkus = new Set(skus);

    if (uniqueSkus.size !== skus.length) {
      const duplicates = [
        ...new Set(skus.filter((sku, i) => skus.indexOf(sku) !== i)),
      ];
      throw new BadRequestException(
        `Duplicate SKU(s) found in request: ${duplicates.join(', ')}`,
      );
    }
  }

  // Ensures Product and Variant attribute keys don't overlap
  static validateNoAttributeOverlap(
    productAttributes: Prisma.InputJsonValue,
    variants: VariantLike[],
  ): void {
    const productKeys = new Set(keysOf(productAttributes));

    variants.forEach((variant, index) => {
      const variantKeys = keysOf(variant.attributes);
      const overlap = variantKeys.filter((key) => productKeys.has(key));

      if (overlap.length > 0) {
        throw new BadRequestException(
          `Variant at index ${index} (SKU: ${variant.sku}) has attribute keys ` +
            `that overlap with Product-level attributes: ${overlap.join(', ')}`,
        );
      }
    });
  }

  static validateAll(
    productAttributes: Prisma.InputJsonValue,
    variants: VariantLike[],
  ): void {
    this.validateNoDuplicateSkus(variants);
    this.validateNoAttributeOverlap(productAttributes, variants);
  }
}
