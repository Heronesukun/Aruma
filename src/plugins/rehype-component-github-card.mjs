import { h } from "hastscript";

/**
 * Creates a GitHub Card component.
 *
 * @param {Object} properties - The properties of the component.
 * @param {string} properties.repo - The GitHub repository in the format "owner/repo".
 * @param {import('mdast').RootContent[]} children - The children elements of the component.
 * @returns {import('mdast').Parent} The created GitHub Card component.
 */
export function GithubCardComponent(properties, children) {
	if (Array.isArray(children) && children.length !== 0)
		return h("div", { class: "hidden" }, [
			'Invalid directive. ("github" directive must be leaf type "::github{repo="owner/repo"}")',
		]);

	const repo =
		typeof properties?.repo === "string" ? properties.repo.trim() : "";
	const repoMatch = repo.match(/^([A-Za-z0-9_.-]+)\/([A-Za-z0-9_.-]+)$/);

	if (!repoMatch)
		return h(
			"div",
			{ class: "hidden" },
			'Invalid repository. ("repo" attribute must be in the format "owner/repo")',
		);

	const [, owner, repository] = repoMatch;
	const githubUrl = `https://github.com/${encodeURIComponent(owner)}/${encodeURIComponent(repository)}`;

	const nAvatar = h("div", { class: "gc-avatar" });
	const nLanguage = h("span", { class: "gc-language" }, "Waiting...");

	const nTitle = h("div", { class: "gc-titlebar" }, [
		h("div", { class: "gc-titlebar-left" }, [
			h("div", { class: "gc-owner" }, [
				nAvatar,
				h("div", { class: "gc-user" }, repo.split("/")[0]),
			]),
			h("div", { class: "gc-divider" }, "/"),
			h("div", { class: "gc-repo" }, repo.split("/")[1]),
		]),
		h("div", { class: "github-logo" }),
	]);

	const nDescription = h(
		"div",
		{ class: "gc-description" },
		"Waiting for api.github.com...",
	);

	const nStars = h("div", { class: "gc-stars" }, "00K");
	const nForks = h("div", { class: "gc-forks" }, "0K");
	const nLicense = h("div", { class: "gc-license" }, "0K");

	const nScript = h(
		"script",
		{ type: "text/javascript" },
		`
		(() => {
			const script = document.currentScript;
			const card = script?.closest("[data-github-repo]");
			if (!(card instanceof HTMLAnchorElement)) return;

			const repo = card.dataset.githubRepo;
			const parts = repo?.split("/") ?? [];
			if (
				parts.length !== 2 ||
				!parts.every((part) => /^[A-Za-z0-9_.-]+$/.test(part))
			) {
				card.classList.add("fetch-error");
				return;
			}

			const apiUrl = new URL("https://api.github.com/repos/");
			apiUrl.pathname += parts.map(encodeURIComponent).join("/");
			const formatNumber = (value) =>
				Intl.NumberFormat("en-US", {
					notation: "compact",
					maximumFractionDigits: 1,
				}).format(Number(value) || 0).replaceAll("\\u202f", "");

			fetch(apiUrl, { referrerPolicy: "no-referrer" })
				.then((response) => {
					if (!response.ok) throw new Error("GitHub API request failed");
					return response.json();
				})
				.then((data) => {
					const description = card.querySelector(".gc-description");
					const language = card.querySelector(".gc-language");
					const forks = card.querySelector(".gc-forks");
					const stars = card.querySelector(".gc-stars");
					const license = card.querySelector(".gc-license");
					const avatar = card.querySelector(".gc-avatar");

					if (description)
						description.textContent =
							data.description?.replace(/:[a-zA-Z0-9_]+:/g, "") ||
							"Description not set";
					if (language) language.textContent = data.language || "Unknown";
					if (forks) forks.textContent = formatNumber(data.forks);
					if (stars) stars.textContent = formatNumber(data.stargazers_count);
					if (license)
						license.textContent = data.license?.spdx_id || "no-license";

					if (avatar && data.owner?.avatar_url) {
						const avatarUrl = new URL(data.owner.avatar_url);
						if (avatarUrl.protocol === "https:") {
							avatar.style.backgroundImage =
								"url(" + JSON.stringify(avatarUrl.href) + ")";
							avatar.style.backgroundColor = "transparent";
						}
					}

					card.classList.remove("fetch-waiting");
				})
				.catch(() => card.classList.add("fetch-error"));
		})();
    `,
	);

	return h(
		"a",
		{
			class: "card-github fetch-waiting no-styling",
			href: githubUrl,
			target: "_blank",
			rel: "noopener noreferrer",
			"data-github-repo": repo,
		},
		[
			nTitle,
			nDescription,
			h("div", { class: "gc-infobar" }, [
				nStars,
				nForks,
				nLicense,
				nLanguage,
			]),
			nScript,
		],
	);
}
