import fs from 'fs/promises';
import path from 'path';
import CleanCSS from 'clean-css';
import {
  DIST_DIR,
  STYLES_SRC_DIR,
} from './utils';

const timeHandle = 'Browser assets built';

export async function buildStyles(): Promise<void> {
  try {
    const styles = await fs.readFile(path.join(STYLES_SRC_DIR, 'base.css'));
    const minified = new CleanCSS({}).minify(styles);

    await fs.mkdir(DIST_DIR, { recursive: true });
    await fs.writeFile(path.join(DIST_DIR, 'styles.css'), minified.styles);
  } catch (err) {
    console.error(err);
  }
}

export default async function buildBrowserAssets() {
  try {
    console.time(timeHandle);

    await Promise.all([
      buildStyles(),
    ]);

    console.timeEnd(timeHandle);
  } catch (err) {
    console.error(err);
  }
}

