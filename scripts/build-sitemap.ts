import fs from 'fs/promises';
import path from 'path';
import { SitemapStream, streamToPromise } from 'sitemap';
import { Readable } from 'stream';
import {
  BASE_URL,
  DIST_DIR,
} from './utils';

const timeHandle = 'Built site map';

interface SitemapMetadata {
  changefreq?: string;
  priority?: number;
  lastmod?: string; // YYYY-MM-DD
};

const sitemapData = [];
const sitemapUrls = {};

export function addToSitemap(url: string, sitemapMetadata: SitemapMetadata = {}): void {
  const resolvedUrl = /^http/.test(url) ? url : new URL(url, BASE_URL).href;

  if (sitemapUrls[resolvedUrl]) {
    console.warn(`[WARNING] URL ${url} is already included in sitemap`);
  } else {
    sitemapUrls[resolvedUrl] = true;
    sitemapData.push({
      url: resolvedUrl,
      ...sitemapMetadata,
    });
  }
}

export default async function buildSiteMap(): Promise<void> {
  try {
    console.time(timeHandle);

    const sitemapStream = new SitemapStream({
      hostname: 'https://principledengineer.com',
    });

    const xml = await streamToPromise(Readable.from(sitemapData).pipe(sitemapStream));
    await fs.writeFile(path.join(DIST_DIR, 'sitemap.xml'), xml);

    console.timeEnd(timeHandle);
  } catch (err) {
    console.error(err);
  }
}
