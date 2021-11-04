import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app/app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //use pipes to validate requests
  app.useGlobalPipes(
    new ValidationPipe()
  );

  //configuration for swagger
  const config = new DocumentBuilder()
    .setTitle('Combinator')
    .setDescription('Combinator website API description')
    .setVersion('1.0') 
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(5000);
}
bootstrap();
