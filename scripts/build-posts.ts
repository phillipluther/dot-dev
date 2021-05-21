// pass-through for debugging
export { default } from './get-post-data';

// import fs from 'fs/promises';
// import path from 'path';
// import nunjucks from 'nunjucks';
// import remark from 'remark';
// import remarkHtml from 'remark-html';
// import remarkFrontmatter from 'remark-frontmatter';
// import remarkExtractFrontmatter from 'remark-extract-frontmatter';
// import yaml from 'yaml';
// import {
//   POSTS_DIR,
//   DIST_DIR,
//   TEMPLATES_DIR,
//   BASE_URL,
// } from './constants';

// export default async function() {
//   try {
//     const dirContents = await fs.readdir(POSTS_DIR);
    
//     nunjucks.configure(TEMPLATES_DIR, {
//       autoescape: true,
//     });
    
//     await Promise.all(dirContents.map(async (dir) => {
//       const markdownFilePath = path.join(POSTS_DIR, `${dir}/index.md`);
//       const markdown = (await fs.readFile(markdownFilePath)).toString();

//       remark()
//         .use(remarkHtml)
//         .use(remarkFrontmatter)
//         .use(remarkExtractFrontmatter, { yaml: yaml.parse })
//         .process(markdown, async (err, parsed) => {
//           try {
//             if (!err && parsed) {
//               const { data, contents: content } = parsed;
//               const url = new URL(dir, BASE_URL);
//               const rendered = nunjucks.render('post.njk', {
//                 ...data as object,
//                 content,
//                 url,
//               });

//               const postDir = path.join(DIST_DIR, dir);
//               await fs.mkdir(postDir, { recursive: true });
//               await fs.writeFile(path.join(postDir, 'index.html'), rendered);
//             } else {
//               throw err;
//             }
//           } catch (writeError) {
//             console.error(writeError);
//           }
//         });
//     }));

//   } catch (err) {
//     console.error(err);
//   }
// }
