// 全局类型声明 - 用于 Astro define:vars 指令的类型支持

declare interface PostDataItem {
	id: string;
	title: string;
	description: string;
	category: string;
	tags: string[];
	pubDate: string;
	image: string;
}

declare const postsData: PostDataItem[];

declare const copyCodeText: string;
declare const copySuccessText: string;
