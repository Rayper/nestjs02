import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(
    AppModule,
    // {
    //   // apa aja yang akan ditampilkan oleh logger
    //   logger: ['error', 'warn', 'debug']
    // }
    );
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
}
bootstrap();
