import { Type } from "class-transformer";
import { IsOptional, IsString, IsNumber, IsIn, IsInt, Min, Max } from "class-validator";

export class FindProductsQueryDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  @IsIn(["name", "category", "brand", "price"], { 
    message: "sortBy must be one of 'name', 'category', 'brand', or 'price'" 
  })
  sortBy?: "name" | "category" | "brand" | "price" = "name";

  @IsOptional()
  @IsString()
  @IsIn(["asc", "desc"], { 
    message: "sortOrder must be 'asc' or 'desc'" 
  })
  sortOrder?: "asc" | "desc" = "asc";

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