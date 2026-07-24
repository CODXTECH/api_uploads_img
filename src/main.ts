import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import morgan from 'morgan'
import dotenv from 'dotenv';
dotenv.config();

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);

    app.use(morgan('combined')); // <-- LOGS DE PETICIONES HTTP

    app.useStaticAssets(join(process.cwd(), 'uploads'), {
        prefix: '/uploads/',
    });

    app.useGlobalFilters(new AllExceptionsFilter());        // <-- CAPTURA ERRORES GLOBALES

    await app.listen(process.env.PORT ?? 3002, '0.0.0.0');
    console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();