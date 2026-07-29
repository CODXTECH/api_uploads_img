import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';   // configuración principal
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import morgan from 'morgan'
import dotenv from 'dotenv';
dotenv.config();

async function bootstrap() {
    // NestExpressApplication es una interfaz que extiende la funcionalidad de NestApplication y proporciona características específicas para aplicaciones Express.
    // NestFactory: Es una clase proporcionada por NestJS que se utiliza para crear instancias de aplicaciones NestJS. Permite configurar y arrancar la aplicación.
    const app = await NestFactory.create<NestExpressApplication>(AppModule);

    app.use(morgan('combined')); // <-- LOGS DE PETICIONES HTTP

    app.useStaticAssets(join(process.cwd(), 'uploads'), { prefix: '/uploads/' });   // <-- CONFIGURACIÓN DE RUTA PARA SERVIR ARCHIVOS ESTÁTICOS (IMAGENES)

    app.useGlobalFilters(new AllExceptionsFilter());        // <-- CAPTURA ERRORES GLOBALES

    await app.listen(process.env.PORT ?? 3005, '0.0.0.0');
    console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();