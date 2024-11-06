import 'dotenv/config';

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Books and Authors API')
    .setDescription('API documentation for managing books and authors')
    .setVersion('1.0')
    .addTag('books')
    .addTag('authors')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api-docs', app, document);

  app.enableCors({
    origin: '*', // Replace with your frontend URL
    methods: 'GET,POST,PUT,DELETE', // Adjust as needed
    allowedHeaders: 'Content-Type, Accept', // You can customize allowed headers
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
