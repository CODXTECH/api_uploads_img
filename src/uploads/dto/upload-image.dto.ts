// upload-image.dto.ts
import { IsString, IsOptional } from 'class-validator';

export class UploadImageDto {
  @IsString()
  negocio!: string;

  @IsOptional()
  @IsString()
  documento?: string;
}