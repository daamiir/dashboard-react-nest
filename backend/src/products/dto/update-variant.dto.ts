import { Prisma } from '@prisma/client';
import { Transform } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  Min,
  IsInt,
  IsArray,
  IsObject,
  IsOptional,
  IsUUID,
} from 'class-validator';

export class UpdateVariantDto {
  // Upsert
  @IsOptional()
  @IsUUID()
  id?: string;

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

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];

  @IsObject()
  attributes!: Prisma.InputJsonValue;
}
