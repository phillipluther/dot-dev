import buildPosts from './build-posts';
import buildTagArchives from './build-tag-archives';
import buildPostIndex from './build-post-index';
import buildSitemap from './build-sitemap';

buildPosts();
buildPostIndex();
buildTagArchives();
buildSitemap();
