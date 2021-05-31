import path from 'path';
import marked from 'marked';
import prism from 'prismjs';
import loadLanguages from 'prismjs/components/';
import { getImageSourceAttrs } from './process-image';

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

marked.use({
  renderer: {
    image(href, title, alt) {
      const srcPath = path.resolve(href);
      const imageAttrs = [getImageSourceAttrs(srcPath)];
      
      if (title) {
        imageAttrs.push(`title="${title}"`);
      }

      if (alt) {
        imageAttrs.push(`alt="${alt}"`);
      }

      console.log('IMAGE ATTRS', imageAttrs);
      return `<img ${imageAttrs.join(' ')}>`;
    },
  },
});

// override the default wrapping of <img> tags in <p>; our custom renderer takes care of
// block-level wrappers for images
marked.Renderer.prototype.paragraph = (mdSnippet) => mdSnippet.startsWith('<img')
  ? `<div class="processed-md-image">${mdSnippet}</div>\n`
  : `<p>${mdSnippet}</p>`;

export default (md: string, options: object): string => marked.parse(md, options = {});
