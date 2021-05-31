import path from 'path';
import sharp from 'sharp';
import { IMAGE_SIZES, SUPPORTED_IMAGE_TYPES, SRC_DIR, DIST_DIR } from './constants';

// cache of processed image names for use in srcsets, organized by source path
const processedImages = {};

function getImageExtension(imgPath: string): string {
  return SUPPORTED_IMAGE_TYPES.reduce((ext, supportedExtension) => {
    const extensionExp = new RegExp(`\\${supportedExtension}$`);
    if (extensionExp.test(imgPath)) {
      ext = supportedExtension;
    }

    return ext;
  }, '');
}

export function getImageSourceAttrs(srcPath: string): string {
  const processed = processedImages[srcPath];

  // nothing to do here ... doesn't look like the image has been processed at all
  if (!processed) {
    return `src="${srcPath}"`;
  }

  const sources = Object.keys(processed).reduce((sourceSets, size) => {
    const { width } = IMAGE_SIZES[size];
    
    sourceSets.push(`${processed[size]} ${width}w`);
    return sourceSets;
  }, []);

  return `src="${processed.lg}" srcset="${sources.join(', ')}"`;
}

export async function processImage(srcPath: string): Promise<void> {
  try {
    const processed = processedImages[srcPath] || {};

    // if the image has already been processed, just return paths/srcset
    if (Object.keys(processed).length > 0) {
      return processed;
    }

    const filename = path.basename(srcPath);
    const extension = getImageExtension(filename);
    const hash = filename.replace(extension, '');
    const slug = srcPath.replace(SRC_DIR, '');
    const destDir = path.join(DIST_DIR, path.dirname(slug));

    if (extension === '') {
      console.warn(`[WARNING] ${srcPath} appears to be an unsupported image type`);
    } else {
      await Promise.all(Object.keys(IMAGE_SIZES).map((size) => {
        const { width, height } = IMAGE_SIZES[size];
        const processedName = `${hash}-${width}x${height}${extension}`;
        const processedPath = path.join(destDir, processedName);

        processed[size] = processedPath.replace(DIST_DIR, '');

        return sharp(srcPath)
          .resize(width, height)
          .toFile(processedPath);
      }));
    }

    processedImages[srcPath] = processed;
  } catch (err) {
    console.error(err);
  }
};
