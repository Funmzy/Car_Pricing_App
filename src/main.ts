import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

const cookieSession = require('cookie-session');

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);
    app.use(
      cookieSession({
        keys: ['abcdef'],
      }),
    );
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );
    await app.listen(6000);
  } catch (e) {
    console.log(e);
  }
}
bootstrap();
