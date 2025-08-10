import { Injectable, Inject } from '@nestjs/common';
import { UploadApiErrorResponse, UploadApiResponse, v2 as cloudinary } from 'cloudinary';
import { CLOUDINARY } from './constants';

// Define el tipo Cloudinary
type Cloudinary = typeof cloudinary;

@Injectable()
export class CloudinaryService {
  constructor(@Inject(CLOUDINARY) private readonly cloudinary: Cloudinary) {}

  async uploadImage(file: Express.Multer.File, folder: string): Promise<string> {
    return new Promise((resolve, reject) => {
      this.cloudinary.uploader.upload_stream(
        { folder },
        (error: UploadApiErrorResponse, result: UploadApiResponse) => {
          if (error) return reject(error);
          resolve(result.secure_url);
        }
      ).end(file.buffer);
    });
  }

  async deleteImage(publicId: string): Promise<void> {
    await this.cloudinary.uploader.destroy(publicId);
  }

  async uploadPdf(file: Express.Multer.File, folder: string): Promise<string> {
    return new Promise((resolve, reject) => {
      this.cloudinary.uploader.upload_stream(
        { 
          folder,
          resource_type: 'raw', // Para PDFs
          format: 'pdf'
        },
        (error: UploadApiErrorResponse, result: UploadApiResponse) => {
          if (error) return reject(error);
          resolve(result.secure_url);
        }
      ).end(file.buffer);
    });
  }

  async deleteFile(url: string): Promise<void> {
    try {
      const fileName = url.split('/').pop();
      if (!fileName) return;
      const publicId = fileName.split('.')[0];
      await this.cloudinary.uploader.destroy(publicId, { resource_type: 'raw' });
    } catch (error) {
      console.error('Error al eliminar archivo de Cloudinary:', error);
    }
  }

}