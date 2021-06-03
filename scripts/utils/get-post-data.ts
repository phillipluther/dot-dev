import fs from 'fs/promises';
import path from 'path';
import dayjs from 'dayjs';
import { default as graymatter } from 'gray-matter';
import { getResponsiveImageAttrs } from './process-image';
import processMarkdown from './process-markdown';
import {
  POSTS_SRC_DIR,
  BASE_URL,
} from './constants';

export interface PostMetadata {
  title: string;
  date: string;
  description?: string;
  coverImage?: string;
  slug?: string;
  tags?: string[];
};

export interface PostData {
  metadata: PostMetadata;
  markdown: string;
  html: string;
  assets: string[];
};

const timeHandle = 'Gathered post data';

async function getPostData(): Promise<PostData[]> {
  try {
    console.time(timeHandle);
    const postDirs: string[] = await fs.readdir(POSTS_SRC_DIR);

    const postData = await Promise.all(postDirs.map(async (dirname) => {  
      const dirPath = path.join(POSTS_SRC_DIR, dirname);
      const dirContents = await fs.readdir(dirPath);
      const mdFileContents = await fs.readFile(path.join(dirPath, 'index.md'), 'utf8');

      const { data, content: markdown } = graymatter(mdFileContents);
      const { href: url, pathname: slug } = new URL(`posts/${dirname}`, BASE_URL);

      // ensure we update the processed cover image source
      if (data.coverImage) {
        data.coverImageSrc = getResponsiveImageAttrs(path.join('/posts', dirname, data.coverImage));
      }

      return {
        metadata: {
          ...data as PostMetadata,
          url,
          slug,
        },
        markdown,
        html: processMarkdown(markdown, slug, { baseUrl: BASE_URL }),
        assets: dirContents.reduce((postAssets, filename) => {
          if (/\.md$/.test(filename) === false) {
            postAssets.push(path.join(dirPath, filename));
          }

          return postAssets;
        }, []),
      };
    }));

    console.timeEnd(timeHandle);
    return postData;
  } catch (err) {
    console.error(err);
  }
}

// cached results of reading/indexing all post markdown files
let cachedPostData: PostData[];
let toResolve: Promise<PostData[]>;

export default async function fetchPostData(): Promise<PostData[]> {
  if (cachedPostData) {
    return cachedPostData.slice();

  } else if (toResolve) {
    // pending promise; just wait for it ...
    await toResolve;
    // ... and now our cached results should be there
    return cachedPostData.slice();
  }

  toResolve = getPostData()
    .then((postData) => {
      const sortedPostData = postData.sort((a, b) => {
        const { metadata: { date: firstDate }} = a;
        const { metadata: { date: secondDate }} = b;

        return dayjs(firstDate) > dayjs(secondDate) ? -1 : 1;
      });

      cachedPostData = sortedPostData;
      return cachedPostData.slice();
    });

  return await toResolve;
}
