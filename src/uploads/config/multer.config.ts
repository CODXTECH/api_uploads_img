// config/multer.config.ts
import { BadRequestException } from '@nestjs/common';

export const multerConfig = {
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB máximo
  fileFilter: (req, file, callback) => {
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.mimetype)) {
      return callback(
        new BadRequestException(`Tipo de archivo no permitido: ${file.mimetype}`),
        false,
      );
    }
    callback(null, true);
  },
};