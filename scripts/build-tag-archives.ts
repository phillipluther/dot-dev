import fs from 'fs/promises';
import path from 'path';
import dashify from 'dashify';
import {
  applyTemplate,
  getPostsByTag,
  tagNameMap,
  DIST_DIR,
} from './utils';

const timeHandle = 'Archives built';

async function buildTagArchives(): Promise<void> {
  try {
    console.time(timeHandle);
    const postsByTag = await getPostsByTag();

    await Promise.all(Object.keys(postsByTag).map(async (tag) => {
      try {
        const tagName = tagNameMap[tag];
        const rendered = applyTemplate('archive.njk', {
          title: tagName,
          description: `Posts from The Principled Engineer about ${tagName.toLowerCase()}`,
          posts: postsByTag[tag].map(({ metadata }) => metadata),
        });
        const archiveDir = path.join(DIST_DIR, '/tags', tag);

        await fs.mkdir(archiveDir, { recursive: true });
        await fs.writeFile(path.join(archiveDir, 'index.html'), rendered);
      } catch (writeErr) {
        console.error(writeErr);
      }
    }));

    console.timeEnd(timeHandle);
  } catch (err) {
    console.error(err);
  }
}

export default buildTagArchives;
