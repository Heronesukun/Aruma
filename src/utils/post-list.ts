import type { CollectionEntry } from "astro:content";

export const POSTS_PER_PAGE = 7;

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
