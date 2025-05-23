import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as process from 'process';
// import { ValidationPipe } from 'src/pipes/validation.pipe';

async function bootstrap() {
  // const app = await NestFactory.create(AppModule);
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: true,
  });

  const config = new DocumentBuilder()
    .setTitle('Swagger')
    .setDescription('API')
    .setVersion('1.0')
    .addTag('swagger')
    .addBearerAuth()
    .addSecurityRequirements('bearer')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  (process.env.MODE !== 'PRODUCTION' ||
    process.env.FRONT_URL === 'course.lat') &&
    SwaggerModule.setup('api', app, document);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  await app.listen(3000);
}
bootstrap();
