import path from 'path';
import sharp from 'sharp';
import {
  BREAKPOINTS,
  IMAGE_SIZES,
  SUPPORTED_IMAGE_TYPES,
} from './constants';

// TODO: can you dynamically build enums in TS? would be nice to just snag the keys
// from IMAGE_SIZES (and something similar for SUPPORTED_IMAGE_TYPES!)
enum ImageSize {
  thumb = 'thumb',
  sm = 'sm',
  md = 'md',
  lg = 'lg',
}

export interface ProcessedImageDetails {
  name: string;
  size: ImageSize;
  width: number;
  height: number;
}

function isValidImage(imgPath: string): boolean {
  return SUPPORTED_IMAGE_TYPES.includes(path.extname(imgPath));
}

function getProcessedImageDetails(imagePath: string, size: ImageSize): ProcessedImageDetails {
  const { width, height } = IMAGE_SIZES[size];
  const extension = path.extname(imagePath);
  const imageName = path.basename(imagePath, extension);

  return {
    name: `${imageName}-${width}x${height}${extension}`,
    width,
    height,
    size,
  };
}

export function getResponsiveImageAttrs(srcPath: string): string {
  // not a supported image type so it was never processed; just return a simple src
  if (!isValidImage(srcPath)) {
    return `src="${srcPath}"`;
  }

  const basePath = path.dirname(srcPath);
  const filename = path.basename(srcPath);

  const sourceSet = [];
  const sizes = [];
  // we'll use the large image size as the default `src` attribute
  let fallbackSrc: string;

  // don't bother grabbing the thumbnail size since 'tis too small for practical use
  ['sm', 'md', 'lg'].forEach((size) => {
    const { name, width } = getProcessedImageDetails(filename, size as ImageSize);
    const imagePath = path.join(basePath, name);

    sourceSet.push(`${imagePath} ${width}w`);
    
    if (size === 'lg') {
      fallbackSrc = imagePath;
      sizes.push(`${BREAKPOINTS.md}`);
    } else {
      sizes.push(`(max-width: ${BREAKPOINTS[size]}) ${width}px`);
    }
  });

  return `src="${fallbackSrc}" srcset="${sourceSet.join(', ')}" sizes="${sizes.join(', ')}"`;
}

export async function processImage(srcPath: string, destDir: string): Promise<void> {
  try {
    if (!isValidImage(srcPath)) {
      console.warn(`[WARNING] ${srcPath} appears to be an unsupported image type`);
      return;
    }

    await Promise.all(Object.keys(IMAGE_SIZES).map((size) => {
      const { name, width, height } = getProcessedImageDetails(srcPath, size as ImageSize);
      const processedPath = path.join(destDir, name);

      return sharp(srcPath)
        .resize(width, height)
        .toFile(processedPath);
    }));
  } catch (err) {
    console.error(err);
  }
}
