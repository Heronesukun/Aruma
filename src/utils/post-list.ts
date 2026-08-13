import { getCollection, type CollectionEntry } from "astro:content";

export const POSTS_PER_PAGE = 7;

/**
 * Returns posts visible in the current environment.
 *
 * Drafts stay available during local development, but production builds must
 * never generate pages, feeds, navigation entries, or statistics for them.
 */
export async function getVisiblePosts(): Promise<CollectionEntry<"post">[]> {
	const posts = await getCollection("post");
	return import.meta.env.PROD
		? posts.filter((post) => !post.data.draft)
		: posts;
}

export function getPostDate(post: CollectionEntry<"post">): Date {
	return (
		post.data.pubDate ??
		post.data.published ??
		post.data.date ??
		new Date(0)
	);
}

export function sortPostsForIndex(
	posts: CollectionEntry<"post">[],
): CollectionEntry<"post">[] {
	return [...posts].sort((a, b) => {
		if (a.data.pinned && !b.data.pinned) return -1;
		if (!a.data.pinned && b.data.pinned) return 1;

		if (a.data.pinned && b.data.pinned) {
			const priorityA = a.data.priority;
			const priorityB = b.data.priority;
			if (priorityA !== undefined && priorityB !== undefined) {
				if (priorityA !== priorityB) return priorityA - priorityB;
			} else if (priorityA !== undefined) {
				return -1;
			} else if (priorityB !== undefined) {
				return 1;
			}
		}

		return getPostDate(b).valueOf() - getPostDate(a).valueOf();
	});
}

export function getIndexPageUrl(page: number): string {
	return page <= 1 ? "/" : `/page/${page}/`;
}
