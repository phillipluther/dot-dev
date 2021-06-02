import fs from 'fs/promises';
import path from 'path';
import {
  applyTemplate,
  processImage,
  getPostData,
  PostData,
  DIST_DIR,
} from './utils';

const timeHandle = 'Posts built';

async function buildPosts(): Promise<PostData[]> {
  try {
    console.time(timeHandle);
    const postData = await getPostData();

    await Promise.all(postData.map(async (post: PostData) => {
      try {
        const { html, metadata, assets } = post;

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

        return postData;
      } catch (writeError) {
        console.error(writeError);
      }
    }));

    console.timeEnd(timeHandle);
    return postData;
  } catch (err) {
    console.error(err);
  }
}

export default buildPosts;
