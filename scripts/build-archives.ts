import fs from 'fs/promises';
import path from 'path';
import nunjucks from 'nunjucks';
import getPostData, { PostData } from './get-post-data';
import { TEMPLATES_DIR, DIST_DIR } from './constants';

const timeHandle = 'Archives built';

async function buildArchives(): Promise<PostData[]> {
  try {
    console.time(timeHandle);
    
    nunjucks.configure(TEMPLATES_DIR, {
      autoescape: true,
    });
    
    const allPostData = await getPostData();
    const postsByTag: object = allPostData.reduce((byTag, postData) => {
      const { tags } = postData;

      tags.forEach((tag) => {
        // TODO" make friendly tag names (hyphenated)
        // const friendlyTag = 

        if (!byTag[tag]) {
          byTag[tag] = [];
        }

        byTag[tag].push(postData);
      });

      return byTag;
    }, {});

    const promisedArchives = Promise.all(Object.keys(postsByTag).map(async (tag) => {
      try {
        const rendered = nunjucks.render('archive.njk', {
          posts: postsByTag[tag],
        });
        const archiveDir = path.join(DIST_DIR, tag);

        await fs.mkdir(archiveDir, { recursive: true });
        // await fs.writeFile(path.join(archiveDir, 'index.html'), rendered);
      } catch (writeError) {
        console.error(writeError);
      }
    }));

    console.timeEnd(timeHandle);
    return {} as any;
  } catch (err) {
    console.error(err);
  }
}

export default buildArchives;
