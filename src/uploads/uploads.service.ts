// uploads.service.ts
import { Injectable, BadRequestException } from '@nestjs/common';
import sharp from 'sharp';
import * as fs from 'fs';
import * as path from 'path';
import { UploadImageDto } from './dto/upload-image.dto';

@Injectable()
export class UploadsService {
    private readonly baseDir = path.join(process.cwd(), 'uploads');

    async saveImage(file: Express.Multer.File, dto: UploadImageDto) {
        if (!file?.buffer || file.buffer.length === 0) {
            throw new BadRequestException('El archivo llegó vacío o corrupto');
        }
        if (!file) throw new BadRequestException('No se envió ninguna imagen');

        const negocio = this.sanitize(dto.negocio);
        const documento = this.sanitize(dto.documento ?? 'general');

        const dirPath = path.join(this.baseDir, negocio, documento);
        fs.mkdirSync(dirPath, { recursive: true });

        const fileName = `${Date.now()}.webp`;
        const fullPath = path.join(dirPath, fileName);

        // Optimización: resize máximo 1200px de ancho, convierte a webp con compresión
        await sharp(file.buffer)
            .resize({ width: 1200, withoutEnlargement: true })
            .webp({ quality: 80 })
            .toFile(fullPath);

        return {
            negocio,
            documento,
            ruta: `/uploads/${negocio}/${documento}/${fileName}`,
        };
    }

    async deleteImage(negocio: string, documento: string, archivo: string) {
        const negocioSan = this.sanitize(negocio);
        const documentoSan = this.sanitize(documento);
        const filePath = path.join(this.baseDir, negocioSan, documentoSan, archivo);

        if (!fs.existsSync(filePath)) {
            throw new BadRequestException('La imagen no existe');
        }

        fs.unlinkSync(filePath);

        return {
            message: 'Imagen eliminada correctamente',
            ruta: `/uploads/${negocioSan}/${documentoSan}/${archivo}`,
        };
    }

    // uploads.service.ts
    async replaceImage(negocio: string, documento: string, archivo: string, file: Express.Multer.File) {
        if (!file?.buffer) {
            throw new BadRequestException('No se envió ninguna imagen');
        }

        const negocioSan = this.sanitize(negocio);
        const documentoSan = this.sanitize(documento);
        const filePath = path.join(this.baseDir, negocioSan, documentoSan, archivo);

        if (!fs.existsSync(filePath)) {
            throw new BadRequestException('La imagen no existe');
        }

        // Sobreescribe el mismo archivo con la nueva imagen optimizada
        await sharp(file.buffer)
            .resize({ width: 1200, withoutEnlargement: true })
            .webp({ quality: 80 })
            .toFile(filePath + '.tmp');

        // Reemplaza el archivo original (evita corrupción si sharp falla a medias)
        fs.renameSync(filePath + '.tmp', filePath);

        return {
            message: 'Imagen actualizada correctamente',
            ruta: `/uploads/${negocioSan}/${documentoSan}/${archivo}`,
        };
    }

    // Evita path traversal y caracteres raros en nombres de carpeta
    private sanitize(value: string): string {
        return value
            .toLowerCase()
            .trim()
            .replace(/\s+/g, '-')
            .replace(/[^a-z0-9-_]/g, '');
    }
}