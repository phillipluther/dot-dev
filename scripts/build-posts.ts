import fs from 'fs/promises';
import path from 'path';
import { addToSitemap } from './build-sitemap';
import {
  applyTemplate,
  processImage,
  getPostData,
  PostData,
  DIST_DIR,
} from './utils';

const timeHandle = 'Posts built';

export async function buildPost(postData: PostData): Promise<void> {
  try {
    const { html, metadata, assets } = postData;

    // render the post HTML from our template
    const { slug, ...templateProps } = metadata;
    const rendered = applyTemplate('post.njk', {
      ...templateProps,
      content: html,
    });
    const postDir = path.join(DIST_DIR, slug);

    await fs.mkdir(postDir, { recursive: true });
    await fs.writeFile(path.join(postDir, 'index.html'), rendered);
    await Promise.all(assets.map((assetSrc) => processImage(assetSrc, postDir)));

    addToSitemap(metadata.url);
  } catch (err) {
    console.error(err);
  }
}

export default async function buildPosts(): Promise<void> {
  try {
    console.time(timeHandle);
    const postData = await getPostData();

    await Promise.all(postData.map(buildPost));

    console.timeEnd(timeHandle);
  } catch (err) {
    console.error(err);
  }
}
