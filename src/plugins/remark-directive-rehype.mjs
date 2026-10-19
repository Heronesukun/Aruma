import { visit } from "unist-util-visit";

const ALLOWED_DIRECTIVES = new Map([["github", new Set(["repo"])]]);

/**
 * Parses directive nodes in markdown and converts them to HTML elements.
 * This allows using ::directive{attr="value"} syntax in markdown.
 */
export function parseDirectiveNode() {
	return (tree) => {
		visit(tree, (node) => {
			if (
				node.type === "containerDirective" ||
				node.type === "leafDirective" ||
				node.type === "textDirective"
			) {
				const data = node.data || (node.data = {});
				const allowedAttributes = ALLOWED_DIRECTIVES.get(node.name);

				if (!allowedAttributes) {
					data.hName =
						node.type === "containerDirective" ? "div" : "span";
					data.hProperties = { className: ["unsupported-directive"] };
					return;
				}

				const attributes = node.attributes || {};
				data.hName = node.name;
				data.hProperties = Object.fromEntries(
					Object.entries(attributes).filter(
						([name, value]) =>
							allowedAttributes.has(name) &&
							typeof value === "string",
					),
				);
			}
		});
	};
}
