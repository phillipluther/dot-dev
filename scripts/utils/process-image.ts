import path from 'path';
import fs from 'fs/promises';
import sharp from 'sharp';
import { IMAGE_SIZES, SUPPORTED_IMAGE_TYPES } from './constants';

export function getImageExtension(imgPath: string): string {
  return SUPPORTED_IMAGE_TYPES.reduce((ext, supportedExtension) => {
    const extensionExp = new RegExp(`\\${supportedExtension}$`);
    if (extensionExp.test(imgPath)) {
      ext = supportedExtension;
    }

    return ext;
  }, '');
}

export function getImageName(imgPath: string, size: string, ext?: string): string {
  const { width, height } = IMAGE_SIZES[size];
  const sizeHash = `-${width}x${height}`;
  const extension = ext || getImageExtension(imgPath);
  const basename = path.basename(imgPath, extension);

  return [basename, sizeHash, extension].join('');
}

export async function processImage(srcPath: string, destDir: string): Promise<string[]> {
  try {
    const processedImages = [];
    const sizeKeys = Object.keys(IMAGE_SIZES);
    const extension = getImageExtension(srcPath);
    const rawImagePath = path.join(destDir, path.basename(srcPath));

    processedImages.push(rawImagePath);
    await fs.copyFile(srcPath, rawImagePath);

    if (extension === '') {
      console.warn(`[WARNING] ${srcPath} appears to be an unsupported image type`);
    } else {
      const imageName = path.basename(srcPath, extension);

      await Promise.all(sizeKeys.map((size) => {
        const { width, height } = IMAGE_SIZES[size];
        const processedImagePath = getImageName(srcPath, size, extension);

        return sharp(srcPath)
          .resize(width, height)
          .toFile(path.join(destDir, processedImagePath));
      }));
    }

    return processedImages;
  } catch (err) {
    console.error(err);
  }
};
