import path from 'path';

export const SRC_DIR = path.resolve('src');
export const POSTS_SRC_DIR = path.join(SRC_DIR, 'posts');
export const TEMPLATES_SRC_DIR = path.join(SRC_DIR, 'templates');

export const BASE_URL = 'https://principledengineer.com';
export const DIST_DIR = path.resolve('dist');

export const DATE_FORMAT = 'MMMM D, YYYY';
export const POSTS_PER_PAGE = 24;

export const IMAGE_SIZES = {
  thumb: {
    width: 96,
    height: 54,
  },
  sm: {
    width: 384,
    height: 216, 
  },
  md: {
    width: 640,
    height: 360,
  },
  lg: {
    width: 1280,
    height: 720,
  },
};

export const BREAKPOINTS = {
  sm: '600px',
  md: '900px',
};

export const SUPPORTED_IMAGE_TYPES = ['.jpg', '.jpeg', '.png', '.gif'];
