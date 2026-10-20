import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { ProductsModule } from './products/products.module.js';
import { UsersModule } from './users/users.module.js';

/**
 * Root Application Module.
 * Configures global configuration, asynchronous database connection via Mongoose,
 * and feature modules.
 */
@Module({
  imports: [
    // Global environment variables loader
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // Asynchronously connect to MongoDB using ConfigService
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>(
          'MONGODB_URI',
          'mongodb://localhost:27017/nest_crud',
        ),
        dbName: configService.get<string>('MONGODB_DB_NAME') || 'nestjs',
      }),
    }),

    // Feature Modules
    ProductsModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
