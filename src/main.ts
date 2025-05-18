import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  // Establece el entorno por defecto como desarrollo si no se ha especificado
  process.env.NODE_ENV = process.env.NODE_ENV || 'development';
  console.log(`Running in ${process.env.NODE_ENV} mode`);

  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  // Configuración de Swagger
  const config = new DocumentBuilder()
    .setTitle('API de Productos')
    .setDescription('API para gestión de productos, categorías y proveedores')
    .setVersion('1.0')
    .addTag('products')
    .addTag('categories')
    .addTag('suppliers')
    .addTag('auth')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = 3000;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
  console.log(
    `Swagger documentation available at: http://localhost:${port}/api`,
  );
}
bootstrap();
