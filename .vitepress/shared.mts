import { defineConfig } from "vitepress";
import { zhSearch } from "./zh.mts";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Cloudreve",

  cleanUrls: true,
  lastUpdated: true,
  themeConfig: {
    siteTitle: false,
    logo: {
      light: "/logo.svg",
      dark: "/logo_light.svg",
    },
    socialLinks: [
      { icon: "github", link: "https://github.com/cloudreve/Cloudreve" },
    ],
    search: {
      provider: "algolia",
      options: {
        appId: "S7JRLMCZAV",
        apiKey: "f14604c870f58b8ea265e5b4a36d05bb",
        indexName: "cloudreve",
        locales: {
          ...zhSearch,
        },
      },
    },
  },
});
