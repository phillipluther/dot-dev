import fs from 'fs/promises';
import path from 'path';
import dashify from 'dashify';
import {
  applyTemplate,
  getPostData,
  DIST_DIR,
} from './utils';

const timeHandle = 'Archives built';

async function buildArchives(): Promise<void> {
  try {
    console.time(timeHandle);
    
    const allPostData = await getPostData();
    const allTagData: object = allPostData.reduce((tagData, postData) => {
      const { tags } = postData.metadata;

      tags.forEach((tag) => {
        const dashifiedTag = dashify(tag);

        if (!tagData[dashifiedTag]) {
          tagData[dashifiedTag] = {
            title: tag,
            description: `Posts from The Principled Engineer about ${tag.toLowerCase()}`,
            posts: [],
          };
        }

        tagData[dashifiedTag].posts.push(postData.metadata);
      });

      return tagData;
    }, {});

    await Promise.all(Object.keys(allTagData).map((tag) => {
      try {
        const rendered = applyTemplate('archive.njk', allTagData[tag]);
        const archiveDir = path.join(DIST_DIR, tag);

        return fs.mkdir(archiveDir, { recursive: true })
          .then(() => {
            fs.writeFile(path.join(archiveDir, 'index.html'), rendered);
          });
      } catch (writeError) {
        console.error(writeError);
      }
    }));

    console.timeEnd(timeHandle);
  } catch (err) {
    console.error(err);
  }
}

export default buildArchives;
