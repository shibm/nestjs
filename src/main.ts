import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { AppModule } from './app.module.js';
import { HttpExceptionFilter } from './common/filters/http-exception.filter.js';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  // Enable Cross-Origin Resource Sharing
  app.enableCors();

  // Set global route prefix (e.g., http://localhost:3000/api/products)
  app.setGlobalPrefix('api');

  // Global pipe for strict request body and query validation using class-validator
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strips any properties that do not have decorators in the DTO
      forbidNonWhitelisted: true, // Throws an error if unknown properties are sent
      transform: true, // Automatically converts incoming payloads to DTO instances
      transformOptions: {
        enableImplicitConversion: true, // Converts string primitives to number/boolean where typed
      },
    }),
  );

  // Global filter for normalized error responses
  app.useGlobalFilters(new HttpExceptionFilter());

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  logger.log(`🚀 NestJS CRUD API is running on: http://localhost:${port}/api`);
  logger.log(`👤 Users endpoint: http://localhost:${port}/api/users`);
  logger.log(`📦 Products endpoint: http://localhost:${port}/api/products`);
}

await bootstrap();
