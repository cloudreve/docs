import { defineConfig } from "vitepress";
import { withMermaid } from "vitepress-plugin-mermaid";
import { tabsMarkdownPlugin } from "vitepress-plugin-tabs";
import en from "./en.mts";
import shared from "./shared.mts";
import zh from "./zh.mts";

export default withMermaid(
  defineConfig({
    ...shared,
    locales: {
      root: { label: "English", link: "/en", ...en },
      zh: { label: "简体中文", link: "/zh", ...zh },
    },
    markdown: {
      config(md) {
        md.use(tabsMarkdownPlugin);
      },
    },
  })
);
