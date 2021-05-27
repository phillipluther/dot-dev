import fs from 'fs/promises';
import path from 'path';
import nunjucks from 'nunjucks';
import getPostData, { PostData, PostMetadata } from './get-post-data';
import { TEMPLATES_DIR, POSTS_DIST_DIR } from './constants';

const timeHandle = 'Posts built';

async function buildPosts(): Promise<PostData[]> {
  try {
    console.time(timeHandle);
    const postData = await getPostData();

    nunjucks.configure(TEMPLATES_DIR, {
      autoescape: true,
    });

    await Promise.all(postData.map(async (post: PostData) => {
      try {
        const { html, metadata, assets } = post;

        // render the post HTML from our template
        const { slug, ...templateProps } = metadata;
        const rendered = nunjucks.render('post.njk', {
          ...templateProps,
          content: html,
        });
        const postDir = path.join(POSTS_DIST_DIR, slug);

        await fs.mkdir(postDir, { recursive: true });
        await fs.writeFile(path.join(postDir, 'index.html'), rendered);

        // copy post assets to the destination
        await Promise.all(assets.map((srcFile) => fs.copyFile(
          srcFile,
          path.join(postDir, path.basename(srcFile)),
        )));

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
