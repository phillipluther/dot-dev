import dashify from 'dashify';
import getPostData, { PostData } from './get-post-data';

const timeHandle = 'Gathered posts by tag';

export interface PostsByTag {
  [key: string]: PostData[];
}

export interface TagNameMap {
  [key: string]: string;
}

let cachedPostsByTag: PostsByTag;
let toResolve: Promise<PostsByTag>;

const getCachedPosts = (tag?: string): PostData[]|PostsByTag => tag ? cachedPostsByTag[tag] : cachedPostsByTag;

export const tagNameMap: TagNameMap = {};

export async function getPostsByTag(tagName?: string): Promise<PostData[]|PostsByTag> {
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
