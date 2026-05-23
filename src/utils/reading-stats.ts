const CJK_CHAR_RE =
	/[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff\uac00-\ud7af]/gu;
const LATIN_WORD_RE = /[A-Za-z0-9]+(?:[._'-][A-Za-z0-9]+)*/g;

export interface ReadingStats {
	wordCount: number;
	readingMinutes: number;
}

function stripMarkdown(content: string): string {
	return content
		.replace(/^---[\s\S]*?---/, " ")
		.replace(/```[\s\S]*?```/g, " ")
		.replace(/~~~[\s\S]*?~~~/g, " ")
		.replace(/<!--[\s\S]*?-->/g, " ")
		.replace(/<[^>]+>/g, " ")
		.replace(/!\[[^\]]*?\]\([^)]*?\)/g, " ")
		.replace(/\[([^\]]+?)\]\([^)]*?\)/g, " $1 ")
		.replace(/`([^`]+?)`/g, " $1 ")
		.replace(/&[a-z0-9#]+;/gi, " ")
		.replace(/^[\t ]{0,3}([#>*+-]|\d+\.)\s+/gm, " ")
		.replace(/[{}\[\]()*_~`|>#-]/g, " ");
}

export function getReadingStats(content = ""): ReadingStats {
	const text = stripMarkdown(content);
	const cjkCount = text.match(CJK_CHAR_RE)?.length ?? 0;
	const latinCount =
		text.replace(CJK_CHAR_RE, " ").match(LATIN_WORD_RE)?.length ?? 0;
	const wordCount = cjkCount + latinCount;

	return {
		wordCount,
		readingMinutes:
			wordCount === 0
				? 0
				: Math.max(1, Math.ceil(cjkCount / 400 + latinCount / 200)),
	};
}

export function formatWordCount(count: number): string {
	return count.toLocaleString("zh-CN");
}
