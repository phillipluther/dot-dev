import path from 'path';
import fs from 'fs/promises';
import sharp from 'sharp';
import { IMAGE_SIZES, SUPPORTED_IMAGE_TYPES, DIST_DIR } from './constants';

// cache of processed image sizes for use in srcsets, organized by path
const imageSizeMap = {};

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

export function getImageSrcset(slug: string): string[] {
  const imageSrcset = imageSizeMap[slug] || [];

  if (!imageSrcset) {
    console.warn(`[WARNING] No srcset found for ${slug}`);
  }

  return imageSrcset;
}

function getRelativeUrlFromPath(path: string): string {
  return path.replace(DIST_DIR, '');
}

export async function processImage(srcPath: string, destDir: string): Promise<string[]> {
  try {
    const processedImages = imageSizeMap[srcPath] || {};

    // if the image has already been processed, just return paths/srcset
    if (processedImages.length > 0) {
      return processedImages;
    }

    const sizeKeys = Object.keys(IMAGE_SIZES);
    const extension = getImageExtension(srcPath);
    const rawImagePath = path.join(destDir, path.basename(srcPath));

    processedImages.raw = getRelativeUrlFromPath(rawImagePath);
    await fs.copyFile(srcPath, rawImagePath);

    if (extension === '') {
      console.warn(`[WARNING] ${srcPath} appears to be an unsupported image type`);
    } else {
      const imageName = path.basename(srcPath, extension);

      await Promise.all(sizeKeys.map((size) => {
        const { width, height } = IMAGE_SIZES[size];
        const processedImageName = getImageName(srcPath, size, extension);
        const processedImagePath = path.join(destDir, processedImageName);

        processedImages[size] = getRelativeUrlFromPath(processedImagePath);

        return sharp(srcPath)
          .resize(width, height)
          .toFile(processedImagePath);
      }));
    }

    imageSizeMap[srcPath] = processedImages;

    return processedImages;
  } catch (err) {
    console.error(err);
  }
};
