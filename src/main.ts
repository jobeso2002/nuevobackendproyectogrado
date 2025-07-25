import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger =new Logger('application');
  const app = await NestFactory.create(AppModule);

  // Habilitar CORS
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173', // Cambia '*' por el dominio específico en producción
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // Permitir cookies y tokens de sesión
    allowedHeaders: 'Content-Type, Authorization',
    
  });

  const config = new DocumentBuilder()
  .setTitle('API Example')
  .setDescription('API Documentation')
  .addBearerAuth(
    {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      in: 'header',
    },
    'mi secreto1',
  )

  .setVersion('1.0')
  .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  // Usa el puerto 4001 
  const port = process.env.PORT || 4001; // Fuerza 4001 si hay fallos
  await app.listen(port);
  logger.log(`Swagger docs: http://localhost:${port}/api`);
}
bootstrap();
