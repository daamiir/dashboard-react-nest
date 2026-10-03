import { Prisma } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsObject,
  IsUUID,
  IsArray,
  ValidateNested,
  ArrayMinSize,
  IsOptional,
} from 'class-validator';
import { CreateVariantDto } from './create-variant.dto';
import { ColorImagesDto } from './color-images.dto';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  brand!: string;

  @IsString()
  @IsNotEmpty()
  description!: string;

  @IsUUID()
  categoryId!: string;

  @IsObject()
  attributes!: Prisma.InputJsonValue;

  @IsArray()
  @ArrayMinSize(1, { message: 'Product must have at least one variant' })
  @ValidateNested({ each: true })
  @Type(() => CreateVariantDto)
  variants!: CreateVariantDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ColorImagesDto)
  colorImages?: ColorImagesDto[];
}
