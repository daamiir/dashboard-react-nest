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
  IsUUID,
} from 'class-validator';

export class UpdateVariantDto {
  // Upsert
  @IsOptional()
  @IsUUID()
  id?: string;

  @IsString()
  @IsNotEmpty()
  sku!: string;

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
