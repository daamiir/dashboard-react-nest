import { Prisma } from '@prisma/client';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  Min,
  IsInt,
  IsArray,
  IsObject,
  IsOptional,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateVariantDto {
  @Transform(({ value }) =>
    typeof value === 'string' && value.trim() === '' ? undefined : value,
  )
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  sku?: string;

  @IsNumber()
  @Min(0)
  price!: number;

  @IsInt()
  @Min(0)
  stockQuantity!: number;

  @IsArray()
  @IsString({ each: true })
  images!: string[];

  @IsObject()
  attributes!: Prisma.InputJsonValue;
}
