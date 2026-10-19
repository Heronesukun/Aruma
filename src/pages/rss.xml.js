import rss from "@astrojs/rss";
import { SITE_DESCRIPTION, SITE_TITLE } from "../consts";
import { getPostDate, getVisiblePosts } from "../utils/post-list";

export async function GET(context) {
	const posts = await getVisiblePosts();
	const feedPosts = [...posts].sort(
		(a, b) => getPostDate(b).valueOf() - getPostDate(a).valueOf(),
	);

	return rss({
		title: SITE_TITLE,
		description: SITE_DESCRIPTION,
		site: context.site,
		items: feedPosts.map((post) => ({
			title: post.data.title,
			description: post.data.description,
			pubDate: getPostDate(post),
			categories: post.data.tags,
			link: `/post/${post.id}/`,
		})),
	});
}
