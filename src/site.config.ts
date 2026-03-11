import avatarImage from './assets/home/logo.webp';
import backgroundImage from './assets/home/bg.webp';
import sidebarImage from './assets/home/sidebar.webp';
import type { SiteConfig } from './types/site-config';

export const siteConfig: SiteConfig = {
  title: "To The Neri",
  description: "没有梦想的拾音喵",
  author: "拾音",
  lang: "zh-cn", // 语言配置：支持 "zh-cn"（中文）、"zh-tw"（繁体中文）、"en"（英文）和 "ja"（日文）
  avatar: avatarImage.src,
  background: backgroundImage.src,
  sidebarBg: sidebarImage.src,
  postBackground: "rgba(255, 255, 255, 0.7)", // 文章背景色 (带透明度)
  sidebarBackground: "rgba(255, 255, 255, 0.8)", // 侧边栏背景色
  glassmorphism: true,
  social: [
    { name: "GitHub", url: "https://github.com/Heronesukun", icon: "github" },
    { name: "Twitter", url: "https://twitter.com/apieshiyin", icon: "twitter" },
    { name: "Email", url: "mailto:apieshiyin@foxmail.com", icon: "email" },
  ],
  nav: [
    { name: "home", path: "/", icon: "home" },
    { type: "category", icon: "widgets" },
    { type: "archive", icon: "access_time" },
    { name: "albums", path: "/albums", icon: "photo_album" },
    { name: "friends", path: "/friends", icon: "link" },
    { name: "anime", path: "/anime", icon: "movie" },
    { name: "diary", path: "/diary", icon: "book" },
    { name: "devices", path: "/devices", icon: "devices" },
    {
      name: "other",
      path: "javascript:;",
      icon: "folder",
      children: [
        { name: "about", path: "/about" },
      ]
    },
  ],

  // { type: "divider" } ky1 分隔线
  // { type: "category", icon: "widgets" }, ky2 归档
  // { type: "archive", icon: "access_time" }, ky3 分类

  randomImage: {
    enable: true,
    ignoreHeroImage: false, // 设为 false 时，有封面图的使用自己的封面，没有的则使用随机图
    url: "https://www.loliapi.com/acg/pc", // 默认使用随机二次元图片 API
  },
  featurePages: {
    albums: true,
  },

  font: {
    asciiFont: {
      fontFamily: "ZenMaruGothic-Medium",
      fontWeight: "400",
      localFonts: ["ZenMaruGothic-Medium.ttf"],
      enableCompress: true,
    },
    cjkFont: {
      fontFamily: "zk",
      fontWeight: "400",
      localFonts: ["zk.ttf"],
      enableCompress: true,
    },
  },
};

export const footerConfig = {
  enable: false,
  customHtml: "",
  // 也可以直接编辑 FooterConfig.html 文件来添加备案号等自定义内容
  // 注意：若 customHtml 不为空，则使用 customHtml 中的内容；若 customHtml 留空，则使用 FooterConfig.html 文件中的内容
};
