import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './core/filter/http-exception/http-exception.filter';
import { TransformInterceptor } from './core/interceptor/transform/transform.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.useGlobalFilters(new HttpExceptionFilter()); // 如果在module注入，该异常过滤器可以使用provide的其他service
  app.useGlobalInterceptors(new TransformInterceptor());
  await app.listen(80);
}
bootstrap();
