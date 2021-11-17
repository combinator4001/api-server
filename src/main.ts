import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app/app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { PrismaService } from './app/prisma.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  //use pipes to validate requests
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist : true
    })
  );

  //configuration for swagger
  const config = new DocumentBuilder()
    .setTitle('Combinator')
    .setDescription('Combinator website API description')
    .setVersion('1.0') 
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  //prisma config
  const prismaService: PrismaService = app.get(PrismaService);
  prismaService.enableShutdownHooks(app)

  await app.listen(5000);
}
bootstrap();
