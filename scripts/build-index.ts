import fs from 'fs/promises';
import path from 'path';
import {
  applyTemplate,
  getPostData,
  DIST_DIR,
} from './utils';

const timeHandle = 'Index built';

export default async function buildIndex(): Promise<void> {
  try {
    console.time(timeHandle);

    const postData = await getPostData();
    const sortedPostData = postData.sort((a, b) => {
      const { metadata: { date: firstDate }} = a;
      const { metadata: { date: secondDate }} = b;

      return firstDate > secondDate ? 1 : -1;
    });

    console.log('Sorted', sortedPostData);
  } catch (err) {
    console.error(err);
  }
}
