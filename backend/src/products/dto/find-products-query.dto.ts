import { Type } from 'class-transformer';
import {
  IsOptional,
  IsString,
  IsIn,
  IsInt,
  IsNumber,
  IsUUID,
  Min,
  Max,
} from 'class-validator';

export class FindProductsQueryDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsUUID()
  categoryId?: string;

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
  @IsIn(['name', 'brand', 'price'], {
    message: "sortBy must be one of 'name', 'brand', or 'price'",
  })
  sortBy?: 'name' | 'brand' | 'price' = 'name';

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
