import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class ColorImagesDto {
  @IsString()
  @IsNotEmpty()
  color!: string;

  @IsArray()
  @IsString({ each: true })
  images!: string[];
}
