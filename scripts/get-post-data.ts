import fs from 'fs/promises';
import path from 'path';
import remark from 'remark';
import remarkHtml from 'remark-html';
import remarkFrontmatter from 'remark-frontmatter';
import remarkExtractFrontmatter from 'remark-extract-frontmatter';
import yaml from 'yaml';
import {
  POSTS_DIR,
  BASE_URL,
} from './constants';

export interface PostData {
  title: string;
  date: string;
  description?: string;
  coverImage?: string;
  slug?: string;
  tags?: string[];
};

const timeHandle = 'Gathered post data';

async function getPostData(): Promise<PostData[]> {
  try {
    console.time(timeHandle);
    const postDirs: string[] = await fs.readdir(POSTS_DIR);

    const promisedPostData = Promise.all(postDirs.map(async (dir) => {
      const markdownFilePath = path.join(POSTS_DIR, `${dir}/index.md`);
      const markdownFileContents = (await fs.readFile(markdownFilePath)).toString();

      // TODO: what's the proper type definition for this?
      const parsed: any = remark()
        .use(remarkHtml)
        .use(remarkFrontmatter)
        .use(remarkExtractFrontmatter, { yaml: yaml.parse })
        .processSync(markdownFileContents);

      const { href: url, pathname: slug } = new URL(dir, BASE_URL);
      const {
        contents: content,
        data: {
          title,
          date,
          ...frontmatter
        }
      } = parsed;

      return {
        title,
        date,
        slug,
        url,
        content,
        ...frontmatter,
      };
    }));

    console.timeEnd(timeHandle);
    return promisedPostData;
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
