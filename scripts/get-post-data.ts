import fs from 'fs/promises';
import path from 'path';
import remark from 'remark';
import remarkHtml from 'remark-html';
import remarkFrontmatter from 'remark-frontmatter';
import remarkExtractFrontmatter from 'remark-extract-frontmatter';
import yaml from 'yaml';
import {
  POSTS_DIR,
  DIST_DIR,
  TEMPLATES_DIR,
  BASE_URL,
} from './constants';

interface PostData {
  title: string;
  date: string;
  description?: string;
  coverImage?: string;
  slug?: string;
  tags?: string[];
};

async function getPostData(): Promise<PostData[]> {
  try {
    const postDirs: string[] = await fs.readdir(POSTS_DIR);

    return Promise.all(postDirs.map(async (dir) => {
      const markdownFilePath = path.join(POSTS_DIR, `${dir}/index.md`);
      const markdownFileContents = (await fs.readFile(markdownFilePath)).toString();

      remark()
      .use(remarkHtml)
      .use(remarkFrontmatter)
      .use(remarkExtractFrontmatter, { yaml: yaml.parse })
      .process(markdownFileContents, async (err, parsed) => {
        try {
          if (!err && parsed) {
            const { data: frontmatter, contents } = parsed;
            const url = new URL(dir, BASE_URL);

            console.log('Frontmatter', frontmatter);
          } else {
            throw err;
          }
        } catch (writeError) {
          console.error(writeError);
        }
      });
      return {
        title: 'dummy',
        date: 'dummy',
      };
    }));
  } catch (err) {
    console.error(err);
  }
}

export default getPostData;
