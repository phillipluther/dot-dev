import fs from 'fs/promises';
import path from 'path';
import nunjucks from 'nunjucks';
import getPostData, { PostData } from './get-post-data';
import { TEMPLATES_DIR, DIST_DIR } from './constants';

async function buildPosts(): Promise<PostData[]> {
  try {
    const allPostData = await getPostData();

    nunjucks.configure(TEMPLATES_DIR, {
      autoescape: true,
    });

    return Promise.all(allPostData.map(async(postData: PostData) => {
      try {
        const { slug, ...templateProps } = postData;
        const rendered = nunjucks.render('post.njk', templateProps);
        const postDir = path.join(DIST_DIR, slug);

        await fs.mkdir(postDir, { recursive: true });
        await fs.writeFile(path.join(postDir, 'index.html'), rendered);

        return postData;
      } catch (writeError) {
        console.error(writeError);
      }
    }));
  } catch (err) {
    console.error(err);
  }
}

export default buildPosts;
