import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { TransformInterceptor } from './core/transform.interceptor';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors(
    {
      "origin": true,
      "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
      "preflightContinue": false,
      "credentials": true
    }
  );

  app.use(cookieParser());

  const reflector = app.get(Reflector);
  app.useGlobalInterceptors(new TransformInterceptor(reflector));
  app.useGlobalGuards(new JwtAuthGuard(reflector));
  app.useStaticAssets(join(__dirname, '..', 'public'));

  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
  }));
  await app.listen(process.env.PORT ?? 8000);
}
bootstrap();
