import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

@Injectable()
export class ProfileService {
  constructor(private readonly prisma: PrismaService) {}

  async update(userId: string, dto: UpdateProfileDto) {
    const email = dto.email.toLowerCase();
    const taken = await this.prisma.user.findFirst({
      where: { email, NOT: { id: userId } },
    });
    if (taken) throw new ConflictException('Email is already in use');

    return this.prisma.user.update({
      where: { id: userId },
      data: { name: dto.name, email },
      select: { id: true, name: true, email: true, role: true },
    });
  }

  async changePassword(userId: string, dto: ChangePasswordDto) {
    if (dto.newPassword !== dto.confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }
    const passwordHash = await bcrypt.hash(dto.newPassword, 10);
    await this.prisma.user.update({
      where: { id: userId },
      data: { passwordHash },
    });
    return { message: 'Password updated' };
  }
}
