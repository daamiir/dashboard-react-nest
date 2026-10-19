import { IsString, MaxLength, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @IsString()
  @MinLength(8)
  @MaxLength(64)
  newPassword!: string;

  @IsString()
  confirmPassword!: string;
}
