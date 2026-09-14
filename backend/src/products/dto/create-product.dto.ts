import { Category } from '@prisma/client';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  Min,
  IsInt,
  IsArray,
  IsEnum,
  IsObject,
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

  @IsObject()
  attributes!: Record<string, any>;
}
