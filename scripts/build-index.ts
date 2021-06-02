import fs from 'fs/promises';
import path from 'path';
import dayjs from 'dayjs';
import {
  applyTemplate,
  getPostData,
  PostData,
  DIST_DIR,
  POSTS_PER_PAGE,
} from './utils';

const timeHandle = 'Index built';

export default async function buildIndex(): Promise<void> {
  try {
    console.time(timeHandle);

    const allPostData = await getPostData();
    // taking destructive actions on the post data array; ensure we're not grabbing
    // it by reference
    const sortedPostData = allPostData.slice().sort((a, b) => {
      const { metadata: { date: firstDate }} = a;
      const { metadata: { date: secondDate }} = b;

      return dayjs(firstDate) > dayjs(secondDate) ? -1 : 1;
    });

    // TODO: as the number of posts increases we'll probably have to batch this so
    // it doesn't turn into promise hell ... the tag archives could make use of
    // this, too.
    const buildTasks = [];
    while (sortedPostData.length > 0) {
      const paginated = sortedPostData.splice(0, POSTS_PER_PAGE);
      buildTasks.push(() => {
        const rendered = applyTemplate('archive.njk', {
          title: '',
          description: '',
          posts: paginated.map(({ metadata }) => metadata),
        });


      });
    }

  } catch (err) {
    console.error(err);
  }
}
