import path from 'path';
import marked from 'marked';
import prism from 'prismjs';
import loadLanguages from 'prismjs/components/';
import { IMAGE_SIZES } from './constants';
import { getImageName, getImageExtension } from './process-image';

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
      const extension = getImageExtension(href);
      const imageSources = Object.keys(IMAGE_SIZES).map(
        (size) => `${getImageName(href, size, extension)} ${IMAGE_SIZES[size].width}w`,
      );

      return `
        <div class="custom-image">
          <img src="${path.basename(href)}" alt="${alt}" srcset="${imageSources.join(', ')}>
        </div>
      `;
    },
  },
});

// override the default wrapping of <img> tags in <p>; our custom renderer takes care of
// block-level wrappers for images
marked.Renderer.prototype.paragraph = (mdSnippet) => mdSnippet.startsWith('<img')
  ? `<div class="processed-md-image">${mdSnippet}</div>\n`
  : `<p>${mdSnippet}</p>`;

export default (md: string, options: object): string => marked.parse(md, options = {});
