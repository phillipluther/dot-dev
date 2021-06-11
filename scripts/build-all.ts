import buildPosts from './build-posts';
import buildTagArchives from './build-tag-archives';
import buildPostIndex from './build-post-index';
import buildSitemap from './build-sitemap';
import buildBrowserAssets from './build-browser-assets';

export default (): Promise<void> => Promise.all([
  // these should all utilize `addToSitemap` to register built URLs
  buildPosts(),
  buildPostIndex(),
  buildTagArchives(),
  buildBrowserAssets(),

]).then(buildSitemap);
