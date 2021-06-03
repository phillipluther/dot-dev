import fs from 'fs/promises';
import path from 'path';
import { SitemapStream, streamToPromise } from 'sitemap';
import { Readable } from 'stream';
import {
  getPostData,
  getPostsByTag,
  BASE_URL,
  DIST_DIR,
} from './utils';

const timeHandle = 'Built site map';

interface LinkObj {
  url: string;
  changefreq?: string;
  priority?: number;
  lastmod?: string; // YYYY-MM-DD
};

// TODO: build this out to utilize additional XML props?
function buildLinkObj(url: string): LinkObj {
  return { url };
}

export default async function buildSiteMap(): Promise<void> {
  try {
    console.time(timeHandle);

    const postData = await getPostData();
    const postsByTag = await getPostsByTag();

    const links = []
      .concat(postData.map(({ metadata: { url }}) => buildLinkObj(url)))
      .concat(Object.keys(postsByTag).map((tag) => {
          const { href } = new URL(`/tags/${tag}`, BASE_URL);
          return buildLinkObj(href);
      }));

    const sitemapStream = new SitemapStream({
      hostname: 'https://principledengineer.com',
    });

    const xml = await streamToPromise(Readable.from(links).pipe(sitemapStream));
    await fs.writeFile(path.join(DIST_DIR, 'sitemap.xml'), xml);

    console.timeEnd(timeHandle);
  } catch (err) {
    console.error(err);
  }
}
