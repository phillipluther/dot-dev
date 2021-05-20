import path from 'path';

const SRC_DIR = path.resolve('src');
const DIST_DIR = path.resolve('dist');
const POSTS_DIR = path.join(SRC_DIR, 'posts');
const TEMPLATES_DIR = path.join(SRC_DIR, 'templates');
const BASE_URL = 'https://principledengineer.com';

export {
  BASE_URL,
  SRC_DIR,
  DIST_DIR,
  POSTS_DIR,
  TEMPLATES_DIR,
}

