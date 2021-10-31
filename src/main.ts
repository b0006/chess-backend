declare const module: any;

import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
// import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
// import { json } from 'body-parser';
import { urlencoded, json } from 'express';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // parse application/x-www-form-urlencoded
  app.use(urlencoded({ extended: true }));
  // parse application/json
  app.use(json());

  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // for class-transformer and class-validator
  app.useGlobalPipes(new ValidationPipe());

  // const options = new DocumentBuilder()
  //   .setTitle('ECO BOOM API')
  //   .setDescription('Описание к API')
  //   .setVersion('1.0')
  //   .addBearerAuth({ in: 'header', type: 'http' })
  //   .build();

  // const document = SwaggerModule.createDocument(app, options);
  // SwaggerModule.setup('api/v1', app, document);

  // app.use('/uploads', expressStatic('uploads'));
  await app.listen(4000);

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
