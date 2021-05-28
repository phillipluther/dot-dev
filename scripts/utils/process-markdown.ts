import { default as graymatter } from 'gray-matter';
import marked from 'marked';
import prism from 'prismjs';
import loadLanguages from 'prismjs/components/';

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

// TODO: build this out with responsive image/srcset handling
// marked.use({
//   renderer: {
//     image(href, title, alt) {
//       return `
//         <div class="custom-image">
//           <img src="${href}" alt="${alt}">
//         </div>
//       `;
//     },
//   },
// });

// override the default wrapping of <img> tags in <p>; our custom renderer takes care of
// block-level wrappers for images
marked.Renderer.prototype.paragraph = (mdSnippet) => mdSnippet.startsWith('<img')
  ? `<div class="processed-md-image">${mdSnippet}</div>\n`
  : `<p>${mdSnippet}</p>`;

export default (md: string, options: object): string => marked.parse(md, options = {});
