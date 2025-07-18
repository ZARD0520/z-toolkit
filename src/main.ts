import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './core/filter/http-exception/http-exception.filter';
import { TransformInterceptor } from './core/interceptor/transform/transform.interceptor';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 微服务-提供者demo
  // const app = await NestFactory.createMicroservice<MicroserviceOptions>(
  //   AppModule,
  //   {
  //     transport: Transport.TCP,
  //     options: {
  //       port: 8888,
  //     },
  //   },
  // );
  // 提供者Controller
  // @MessagePattern('sum') or @EventPattern
  // sum(numArr: Array<number>): number {
  //   return numArr.reduce((total, item) => total + item, 0);
  // }

  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new HttpExceptionFilter()); // 如果在module注入，该异常过滤器可以使用provide的其他service
  app.useGlobalInterceptors(new TransformInterceptor());

  const corsOptions = {
    origin:
      process.env.NODE_ENV === 'production'
        ? ['https://your-production-domain.com'] // 生产环境只允许特定域名
        : true, // 开发环境允许所有来源
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Accept, Authorization',
    credentials: true,
  };

  app.enableCors(corsOptions);

  // 接口文档
  const config = new DocumentBuilder()
    .setTitle('Test example')
    .setDescription('The API description')
    .setVersion('1.0')
    .addTag('test')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('doc', app, document);

  await app.listen(3000, '0.0.0.0');
}
bootstrap();
