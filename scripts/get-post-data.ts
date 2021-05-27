import fs from 'fs/promises';
import path from 'path';
import { default as graymatter } from 'gray-matter';
import marked from 'marked';
import prism from 'prismjs';
import loadLanguages from 'prismjs/components/';
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

loadLanguages();

marked.setOptions({
  highlight: (code: string, lang: string) => {
    if (prism.languages[lang]) {
      return prism.highlight(code, prism.languages[lang], lang);
    } else {
      return code;
    }
  },
});

async function getPostData(): Promise<PostData[]> {
  try {
    console.time(timeHandle);
    const postDirs: string[] = await fs.readdir(POSTS_SRC_DIR);

    const postData = await Promise.all(postDirs.map(async (dirname) => {  
      const dirPath = path.join(POSTS_SRC_DIR, dirname);
      const dirContents = await fs.readdir(dirPath);
      const mdFileContents = await fs.readFile(path.join(dirPath, 'index.md'), 'utf8');
      // const assets = dirContents.filter((item) => !/\.md$/.test(item));

      const { data, content: markdown } = graymatter(mdFileContents);
      const { href: url, pathname: slug } = new URL(`posts/${dirname}`, BASE_URL);

      return {
        metadata: {
          ...data as PostMetadata,
          url,
          slug,
        },
        markdown,
        html: marked.parse(markdown),
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

let postData: PostData[]|Promise<PostData[]>;
export default () => {
  if (!postData) {
    postData = getPostData();
  }

  return postData;
}
