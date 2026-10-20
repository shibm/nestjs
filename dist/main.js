import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { AppModule } from './app.module.js';
import { HttpExceptionFilter } from './common/filters/http-exception.filter.js';
async function bootstrap() {
    const logger = new Logger('Bootstrap');
    const app = await NestFactory.create(AppModule);
    app.enableCors();
    app.setGlobalPrefix('api');
    app.useGlobalPipes(new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: {
            enableImplicitConversion: true,
        },
    }));
    app.useGlobalFilters(new HttpExceptionFilter());
    const port = process.env.PORT ?? 3000;
    await app.listen(port);
    logger.log(`🚀 NestJS CRUD API is running on: http://localhost:${port}/api`);
    logger.log(`👤 Users endpoint: http://localhost:${port}/api/users`);
    logger.log(`📦 Products endpoint: http://localhost:${port}/api/products`);
}
await bootstrap();
//# sourceMappingURL=main.js.map