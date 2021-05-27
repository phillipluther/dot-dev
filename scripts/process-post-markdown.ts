import fs from 'fs/promises';
import path from 'path';
import marked from 'marked';
import Prism from 'prismjs';
import loadLanguages from 'prismjs/components/';
import {
  POSTS_SRC_DIR,
  POSTS_DIST_DIR,
} from './constants';

loadLanguages();

marked.setOptions({
  highlight: (code: string, lang: string) => {
    if (Prism.languages[lang]) {
      return Prism.highlight(code, Prism.languages[lang], lang);
    } else {
      return code;
    }
  },
});

async function processPostMarkdown(dirname: string) {
  try {
    const postSrcDir = path.join(POSTS_SRC_DIR, dirname);
    const postDistDir = path.join(POSTS_DIST_DIR, dirname);
    const dirContents = await fs.readdir(postSrcDir);
    const markdown = (await fs.readFile(path.join(postSrcDir, 'index.md'))).toString();
    const postAssets = dirContents.filter((item) => !/\.md$/.test(item));
    const parsed = marked.parse(markdown);

    await fs.mkdir(postDistDir, { recursive: true });
    
    await Promise.all(postAssets.map(async (asset) => {
      try {
        const assetSrcPath = path.join(postSrcDir, asset);
        const assetDestPath = path.join(postDistDir, asset);
        
        await fs.copyFile(assetSrcPath, assetDestPath);
      } catch (copyErr) {
        console.error(copyErr);
      }
    }));

    await fs.writeFile(path.join(postDistDir, 'index.html'), parsed);
  } catch (err) {
    console.error(err);
  }
}

// debugging
processPostMarkdown('hello-world');
// export default processPostMarkdown;

