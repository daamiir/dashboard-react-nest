import { Category } from '@prisma/client';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  Min,
  IsInt,
  IsArray,
  IsEnum,
  IsBoolean,
  IsOptional,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsEnum(Category)
  @IsNotEmpty()
  category!: Category;

  @IsString()
  @IsNotEmpty()
  brand!: string;

  @IsNumber()
  @Min(0)
  price!: number;

  @IsInt()
  @Min(0)
  stockQuantity!: number;

  @IsArray()
  @IsString({ each: true })
  images!: string[];

  @IsString()
  @IsNotEmpty()
  description!: string;

  @IsInt()
  @Min(0)
  ram!: number;

  @IsInt()
  @Min(0)
  storage!: number;

  @IsNumber()
  @Min(0)
  screenSize!: number;

  @IsString()
  @IsNotEmpty()
  processor!: string;

  @IsString()
  @IsNotEmpty()
  color!: string;

  @IsString()
  @IsNotEmpty()
  os!: string;

  @IsInt()
  releaseYear!: number;

  @IsBoolean()
  @IsOptional()
  has5G?: boolean;

  @IsBoolean()
  @IsOptional()
  hasNfc?: boolean;
}
