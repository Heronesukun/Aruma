import { SITE_DESCRIPTION, SITE_TITLE } from "../consts";
import { siteConfig } from "../site.config";
import { getPostDate, getVisiblePosts } from "../utils/post-list";

const XML_ENTITIES = {
	"&": "&amp;",
	"<": "&lt;",
	">": "&gt;",
	'"': "&quot;",
	"'": "&apos;",
};

function escapeXml(value) {
	return String(value).replace(
		/[&<>"']/g,
		(character) => XML_ENTITIES[character],
	);
}

export async function GET(context) {
	const posts = await getVisiblePosts();
	const feedPosts = [...posts].sort(
		(a, b) => getPostDate(b).valueOf() - getPostDate(a).valueOf(),
	);
	const siteUrl = new URL("/", context.site).href;
	const feedUrl = new URL("atom.xml", context.site).href;
	const feedUpdated =
		feedPosts[0]?.data.updatedDate ??
		(feedPosts[0] ? getPostDate(feedPosts[0]) : new Date(0));

	const entries = feedPosts
		.map((post) => {
			const postUrl = new URL(`/post/${post.id}/`, context.site).href;
			const published = getPostDate(post).toISOString();
			const updated = (
				post.data.updatedDate ?? getPostDate(post)
			).toISOString();
			const categories = (post.data.tags ?? [])
				.map((tag) => `<category term="${escapeXml(tag)}" />`)
				.join("");

			return `<entry><title>${escapeXml(post.data.title)}</title><link href="${escapeXml(postUrl)}" /><id>${escapeXml(postUrl)}</id><published>${published}</published><updated>${updated}</updated><summary>${escapeXml(post.data.description)}</summary>${categories}</entry>`;
		})
		.join("");

	const body = `<?xml version="1.0" encoding="UTF-8"?><feed xmlns="http://www.w3.org/2005/Atom"><title>${escapeXml(SITE_TITLE)}</title><subtitle>${escapeXml(SITE_DESCRIPTION)}</subtitle><link href="${escapeXml(siteUrl)}" /><link href="${escapeXml(feedUrl)}" rel="self" type="application/atom+xml" /><id>${escapeXml(siteUrl)}</id><updated>${feedUpdated.toISOString()}</updated><author><name>${escapeXml(siteConfig.author)}</name></author>${entries}</feed>`;

	return new Response(body, {
		headers: {
			"Content-Type": "application/atom+xml; charset=utf-8",
		},
	});
}
