import avatarImage from './assets/home/logo.webp';
import backgroundImage from './assets/home/bg.webp';
import sidebarImage from './assets/home/sidebar.webp';

export const siteConfig = {
  title: "有希",
  description: "有希的个人博客",
  author: "有希",
  lang: "zh-cn", // 语言配置：支持 "zh-cn"（中文）和 "en"（英文）
  avatar: avatarImage.src,
  background: backgroundImage.src,
  sidebarBg: sidebarImage.src,
  postBackground: "rgba(255, 255, 255, 0.7)", // 文章背景色 (带透明度)
  sidebarBackground: "rgba(255, 255, 255, 0.8)", // 侧边栏背景色
  glassmorphism: true,
  social: [
    { name: "GitHub", url: "https://github.com/nut612", icon: "github" },
    { name: "Twitter", url: "https://twitter.com", icon: "twitter" },
    { name: "Email", url: "mailto:example@email.com", icon: "email" },
  ],
  nav: [
    { name: "首页", path: "/", icon: "home" },
    { type: "category", name: "分类", icon: "widgets" },
    { type: "archive", name: "归档", icon: "access_time" },
    { name: "友人帐", path: "/friends", icon: "link" },
    { name: "番剧", path: "/anime", icon: "movie" },
    { 
      name: "其他", 
      path: "javascript:;", 
      icon: "folder",
      children: [
        { name: "关于", path: "/about" },
      ]
    },
  ],

  // { type: "divider" } ky1 分隔线
  // { type: "archive", name: "归档", icon: "access_time" }, ky2 归档
  // { type: "category", name: "分类", icon: "widgets" }, ky3 分类
  randomImage: {
    enable: true,
    ignoreHeroImage: true, // 设为 true 时，即使文章设置了 heroImage 也会强制使用随机图
    url: "https://www.loliapi.com/acg/pc", // 默认使用随机二次元图片 API
  }
};
