import fs from 'fs/promises';
import path from 'path';
import nunjucks from 'nunjucks';
import dashify from 'dashify';
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
    const allTagData: object = allPostData.reduce((tagData, postData) => {
      const { tags } = postData;

      tags.forEach((tag) => {
        const dashifiedTag = dashify(tag);

        if (!tagData[dashifiedTag]) {
          tagData[dashifiedTag] = {
            title: tag,
            description: `Posts from The Principled Engineer about ${tag.toLowerCase()}`,
            posts: [],
          };
        }

        tagData[dashifiedTag].posts.push(postData);
      });

      return tagData;
    }, {});

    const promisedArchives = Promise.all(Object.keys(allTagData).map(async (tag) => {
      try {
        const rendered = nunjucks.render('archive.njk', allTagData[tag]);
        const archiveDir = path.join(DIST_DIR, tag);

        await fs.mkdir(archiveDir, { recursive: true });
        await fs.writeFile(path.join(archiveDir, 'index.html'), rendered);
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
