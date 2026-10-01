import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class UploadsService {
  constructor(config: ConfigService) {
    cloudinary.config({
      cloud_name: config.getOrThrow('CLOUDINARY_CLOUD_NAME'),
      api_key: config.getOrThrow('CLOUDINARY_API_KEY'),
      api_secret: config.getOrThrow('CLOUDINARY_API_SECRET'),
    });
  }

  // Streams the buffer to Cloudinary and returns the secure URL
  uploadImage(file: Express.Multer.File): Promise<string> {
    return new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          { folder: 'products', resource_type: 'image' },
          (err, res) => {
            if (err || !res) {
              console.error('Cloudinary error:', err); // shows the real reason in the backend terminal
              return reject(
                new BadRequestException(err?.message ?? 'Image upload failed'),
              );
            }
            // Original stays in Cloudinary; this URL serves auto format/quality, max 1600px
            resolve(
              res.secure_url.replace(
                '/upload/',
                '/upload/f_auto,q_auto,w_1600,c_limit/',
              ),
            );
          },
        )
        .end(file.buffer);
    });
  }
}
