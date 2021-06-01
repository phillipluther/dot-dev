import path from 'path';
import marked from 'marked';
import prism from 'prismjs';
import loadLanguages from 'prismjs/components/';
import { getResponsiveImageAttrs } from './process-image';

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
      const sourceAttrs = getResponsiveImageAttrs(href) || `src="${href}"`;
      const imageAttrs = [sourceAttrs];

      if (title) {
        imageAttrs.push(`title="${title}"`);
      }

      if (alt) {
        imageAttrs.push(`alt="${alt}"`);
      }

      return `<img ${imageAttrs.join(' ')} loading="lazy">`;
    },
  },
});

// override the default wrapping of <img> tags in <p>; our custom renderer takes care of
// block-level wrappers for images
marked.Renderer.prototype.paragraph = (mdSnippet) => mdSnippet.startsWith('<img')
  ? `<div class="processed-md-image">${mdSnippet}</div>\n`
  : `<p>${mdSnippet}</p>`;

export default (md: string, slug: string, options?: object): string => 
  marked.parse(md, options = {});
