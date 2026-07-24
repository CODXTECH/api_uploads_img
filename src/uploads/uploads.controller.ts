import { Controller, Get, Post, UploadedFile, UseInterceptors, Body, Header, Delete, Param, Patch } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadImageDto } from './dto/upload-image.dto';
import { UploadsService } from './uploads.service';
import { multerConfig } from './config/multer.config';
import * as fs from 'fs';
import * as path from 'path';

@Controller('uploads')
export class UploadsController {

    constructor(private readonly uploadsService: UploadsService) { }

    @Get('/guia')
    @Header('Content-Type', 'text/markdown')
    getDocs() {
        return fs.readFileSync(path.join(process.cwd(), 'api_routes.md'), 'utf-8');
    }

    @Post()
    @UseInterceptors(FileInterceptor('imagen', multerConfig)) // 'imagen' = key del form-data
    async uploadImage(@UploadedFile() file: Express.Multer.File, @Body() dto: UploadImageDto,) {
        return this.uploadsService.saveImage(file, dto);
    }

    @Delete(':negocio/:documento/:archivo')
    async deleteImage(
        @Param('negocio') negocio: string,
        @Param('documento') documento: string,
        @Param('archivo') archivo: string,
    ) {
        return this.uploadsService.deleteImage(negocio, documento, archivo);
    }

    @Patch(':negocio/:documento/:archivo')
    @UseInterceptors(FileInterceptor('imagen', multerConfig))
    async replaceImage(
        @Param('negocio') negocio: string,
        @Param('documento') documento: string,
        @Param('archivo') archivo: string,
        @UploadedFile() file: Express.Multer.File,
    ) {
        return this.uploadsService.replaceImage(negocio, documento, archivo, file);
    }

}
