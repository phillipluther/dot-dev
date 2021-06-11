import browserSync from 'browser-sync';
import path from 'path';
import buildBrowserAssets from './build-browser-assets';
import { buildPost } from './build-posts';
import buildAll from './build-all';
import {
  getPostDataBySourcePath,
  PostData,
  SRC_DIR,
  DIST_DIR,
} from './utils';

const bs = browserSync.create('devServer');

bs.init({
  server: DIST_DIR,
  files: [
    {
      match: path.join(SRC_DIR, '**/*'),
      fn: (e, file) => {
        const browserAssetMatch = file.match(/\.(js|css)$/);
        let toReload: string;

        if(browserAssetMatch) {
          toReload = /\.css/.test(browserAssetMatch[0]) ? 'styles.css' : 'scripts.js';
          buildBrowserAssets().then(() => {
            bs.reload(toReload);
          });
        } else if (/\.md$/.test(file)) {
          const sourcePath = path.join(__dirname, '../', file);

          getPostDataBySourcePath(sourcePath)
            .then((postData) => buildPost(postData))
            .then((postData) => {
              if (postData) {
                const { metadata } = postData as PostData;
                toReload = metadata?.slug;

                bs.reload(toReload);
              }
            })
            .catch(console.error);
        } else {
          buildAll().then(() => {
            bs.reload();
          }).catch(console.error);
        }
      },
    },
  ],
  open: false,
  ui: false,

}, () => {
  console.log('Development server running');
});
