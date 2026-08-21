import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { config } from 'dotenv';

config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true, forbidNonWhitelisted: true }));

  const frontendUrl = process.env.FRONTEND_URL;
  if (!frontendUrl) {
    throw new Error('FRONTEND_URL environment variable is missing.');
  }

  app.enableCors({ origin: frontendUrl });
  
  await app.listen(3000);
}
bootstrap();
