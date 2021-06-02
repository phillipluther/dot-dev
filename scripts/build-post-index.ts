import fs from 'fs/promises';
import path from 'path';
import {
  applyTemplate,
  getPostData,
  DIST_DIR,
  POSTS_PER_PAGE,
} from './utils';

const timeHandle = 'Post index pages built';

function getDescriptionHighlights(postsMetadata) {
  const titles = [postsMetadata[0].title];

  if (postsMetadata[1]) {
    titles.push(postsMetadata[1].title);
  }

  // roughly based on a 160 character count for SEO descriptions; grab two titles (which
  // are, again, roughly based on 60'ish characters for SEO), then punctuate
  return `${titles.join('; ')}; and other posts from The Principled Engineer.`;
}

export default async function buildIndex(): Promise<void> {
  try {
    console.time(timeHandle);

    const buildTasks = [];
    const postData = await getPostData();
    const totalPages = Math.floor(postData.length / POSTS_PER_PAGE) + 1;
    let currentPage = 1;

    // TODO: as the number of posts increases we'll probably have to batch this so
    // it doesn't turn into promise hell ... the tag archives could make use of
    // this, too.
    while (postData.length > 0) {
      const pagePosts = postData.splice(0, POSTS_PER_PAGE);
      const pagePostMetadata = pagePosts.map(({ metadata }) => metadata);
      const paginationMarker = totalPages > 1 ? `(Page ${currentPage} of ${totalPages})` : '';
      const isPageOne = currentPage === 1;

      const rendered = applyTemplate('archive.njk', {
        title: `Blog Posts ${paginationMarker}`,
        description: getDescriptionHighlights(pagePostMetadata),
        posts: pagePostMetadata,
        pagination: {
          totalPages,
          currentPage,
        },
      });

      const destDir = isPageOne ? DIST_DIR : path.join(DIST_DIR, `posts/page/${currentPage}`);

      buildTasks.push(
        fs.mkdir(destDir, { recursive: true })
          .then(() => { fs.writeFile(path.join(destDir, 'index.html'), rendered); })
      );

      currentPage++;
    }

    await Promise.all(buildTasks);
    console.timeEnd(timeHandle);
  } catch (err) {
    console.error(err);
  }
}
