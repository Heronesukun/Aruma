export type SocialLink = {
	name: string;
	url: string;
	icon: string;
};

export type NavItem = {
	name?: string;
	path?: string;
	type?: string;
	icon?: string;
	children?: NavItem[];
};

export type RandomImageConfig = {
	enable: boolean;
	ignoreHeroImage: boolean;
	url: string;
	optimizeApiImage?: boolean; // 是否优化此 API 的图片（默认 false，保持原样）
};

export type FeaturePagesConfig = {
	albums: boolean;
};

export type FooterConfig = {
	enable: boolean;
	customHtml?: string;
};

export type FontCategoryConfig = {
	fontFamily: string;
	fontWeight: string | number;
	localFonts: string[];
	enableCompress: boolean;
};

export type FontConfig = {
	asciiFont: FontCategoryConfig;
	cjkFont: FontCategoryConfig;
};

export type ImageOptimizationConfig = {
	enable: boolean; // 总开关（默认 false）
	apiDomains: string[]; // API 域名排除列表
	quality: number; // 图片质量 (1-100)
	formats: ("webp" | "avif")[]; // 输出格式
	lazyLoading: {
		enable: boolean;
		threshold: string; // 例：'300px'
	};
	preload: {
		enable: boolean;
		criticalImages?: number; // 首屏关键图片数量（默认 3）
		as?: "image" | "fetch"; // 预加载类型
	};
};

export type TwikooConfig = {
	envId: string;
	region?: string;
	lang?: string;
	masterTag?: string; // 博主标识文字
};

export type CommentConfig = {
	enable: boolean;
	twikoo?: TwikooConfig;
};

export type MusicPlayerConfig = {
	enable: boolean; // 是否启用音乐播放器
	mode: "meting" | "local"; // 播放器模式
	meting_api: string; // Meting API 地址
	id: string; // 歌单 ID
	server: string; // 音乐源服务器 (netease/tencent/kugou 等)
	type: string; // 播单类型 (playlist/album/artist 等)
};

export type NoticeConfig = {
	enable: boolean; // 是否启用公告
	content: string; // 公告内容，支持简单 HTML
};

export type SiteConfig = {
	title: string;
	description: string;
	author: string;
	lang: string;
	avatar: string;
	background: string;
	sidebarBg: string;
	postBackground: string;
	sidebarBackground: string;
	glassmorphism: boolean;
	social: SocialLink[];
	nav: NavItem[];
	randomImage: RandomImageConfig;
	featurePages: FeaturePagesConfig;
	font?: FontConfig;
	imageOptimization?: ImageOptimizationConfig;
	comment?: CommentConfig;
	musicPlayer?: MusicPlayerConfig; // 音乐播放器配置
	notice?: NoticeConfig; // 侧边栏公告配置
};
