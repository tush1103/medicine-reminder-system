import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.ORDER_SERVICE_PORT || 3001;
  await app.listen(port);
  console.log(`Order service running on port ${port}`);
}

bootstrap();
