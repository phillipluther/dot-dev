import dashify from 'dashify';
import getPostData from './get-post-data';

let cachedPostsByTag: object;
let toResolve: Promise<object>;

const getCachedPosts = (tag?: string): object => tag ? cachedPostsByTag[tag] : cachedPostsByTag;
const timeHandle = 'Gathered posts by tag';

export const tagNameMap = {};

export async function getPostsByTag(tagName?: string): Promise<object> {
  try {
    if (cachedPostsByTag) {
      return getCachedPosts(tagName);
    } else if (toResolve) {
      await toResolve;
      return getCachedPosts(tagName);
    }

    console.time(timeHandle);
    toResolve = getPostData()
      .then((postData) => {
        return postData.reduce((postsByTag, post) => {
          const { tags } = post.metadata;

          tags.forEach((tagName) => {
            const tag = dashify(tagName);

            if (!postsByTag[tag]) {
              postsByTag[tag] = [];
              tagNameMap[tag] = tagName;
            }

            postsByTag[tag].push(post);
          });

          return postsByTag;
        }, {});
      });

    cachedPostsByTag = await toResolve;
    console.timeEnd(timeHandle);
    return getCachedPosts(tagName);

  } catch (err) {
    console.error(err);
  }
}
