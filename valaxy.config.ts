import { defineValaxyConfig } from "valaxy";
import type { UserThemeConfig } from "valaxy-theme-yun";
import { startAISummary } from "./autoSummary";

// add icons what you will need
const safelist = ["i-ri-home-line"];

/**
 * User Config
 */
export default defineValaxyConfig<UserThemeConfig>({
  // site config see site.config.ts

  theme: "yun",

  themeConfig: {
    banner: {
      enable: false,
      title: "小于同学的异世界",
      cloud: {
        enable: true,
      },
    },

    say: {
      enable: false,
      api: "https://cdn.jsdelivr.net/gh/ElpsyCN/say@gh-pages/sentences.json",
      hitokoto: {
        enable: false,
        api: "https://v1.hitokoto.cn",
      },
    },

    pages: [
      {
        name: "我的小伙伴们",
        url: "/links/",
        icon: "i-ri-links-line",
        color: "bluepurple",
      },
    ],

    footer: {
      since: 2016,
      beian: {
        enable: true,
        icp: "苏ICP备2021011781号",
      },
    },
  },

  unocss: { safelist },

  hooks: {
    "build:before": async () => {
      console.log("start auto summary");
      await startAISummary();
    },
  },
});
