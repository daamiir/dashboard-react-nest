import { Type } from 'class-transformer';
import {
  IsOptional,
  IsString,
  IsIn,
  IsInt,
  IsNumber,
  IsEnum,
  Min,
  Max,
} from 'class-validator';
import { Category } from '@prisma/client';

export class FindProductsQueryDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsEnum(Category)
  category?: Category;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  minPrice?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  maxPrice?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  ram?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  storage?: number;

  @IsOptional()
  @IsString()
  @IsIn(['name', 'category', 'brand', 'price'], {
    message: "sortBy must be one of 'name', 'category', 'brand', or 'price'",
  })
  sortBy?: 'name' | 'category' | 'brand' | 'price' = 'name';

  @IsOptional()
  @IsString()
  @IsIn(['asc', 'desc'], {
    message: "sortOrder must be 'asc' or 'desc'",
  })
  sortOrder?: 'asc' | 'desc' = 'asc';

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;
}
