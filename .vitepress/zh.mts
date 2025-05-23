import { DefaultTheme, defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  lang: "zh-CN",
  description: "Cloudreve 文档",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: "首页", link: "https://cloudreve.org/" },
      { text: "V3 文档", link: "https://docsv3.cloudreve.org" },
    ],

    sidebar: [
      {
        text: "起步",
        collapsed: false,
        items: [
          { text: "欢迎", link: "/zh/" },
          { text: "快速开始", link: "/zh/overview/quickstart" },
          {
            text: "部署",
            collapsed: true,
            link: "/zh/overview/deploy/",
            items: [
              {
                text: "1. 规划部署",
                link: "/zh/overview/deploy/",
              },
              {
                collapsed: true,
                text: "2. 部署到服务器",
                items: [
                  {
                    text: "使用 Docker Compose 部署",
                    link: "/zh/overview/deploy/docker-compose",
                  },
                  {
                    text: "使用 Docker 部署",
                    link: "/zh/overview/deploy/docker",
                  },
                  {
                    text: "使用 进程守护 部署",
                    link: "/zh/overview/deploy/supervisor",
                  },
                ],
              },
              {
                text: "3. 后续步骤",
                link: "/zh/overview/deploy/configure",
              },
            ],
          },
          {
            text: "从源代码编译",
            link: "/zh/overview/build",
          },
          { text: "命令行", link: "/zh/overview/cli" },
          { text: "配置", link: "/zh/overview/configure" },
        ],
      },
      {
        text: "使用",
        collapsed: false,
        items: [
          { text: "概念", link: "/zh/usage/concept" },
          {
            text: "存储",
            collapsed: true,
            link: "/zh/usage/storage/",
            items: [
              {
                text: "对比存储策略",
                link: "/zh/usage/storage/",
              },
              {
                text: "本机存储",
                link: "/zh/usage/storage/local",
              },
              {
                text: "从机存储",
                link: "/zh/usage/storage/remote",
              },
              {
                text: "阿里云 OSS",
                link: "/zh/usage/storage/oss",
              },
              {
                text: "腾讯云 COS",
                link: "/zh/usage/storage/cos",
              },
              {
                text: "OneDrive 或 SharePoint",
                link: "/zh/usage/storage/onedrive",
              },
              {
                text: "Cloudflare R2 (S3 兼容)",
                link: "/zh/usage/storage/r2",
              },
              {
                text: "Google Cloud Storage (S3 兼容)",
                link: "/zh/usage/storage/gcs",
              },
              {
                text: "MinIO (S3 兼容)",
                link: "/zh/usage/storage/minio",
              },
              {
                text: "Backblaze B2 (S3 兼容)",
                link: "/zh/usage/storage/b2",
              },
            ],
          },
          {
            collapsed: true,
            text: "支付",
            items: [
              {
                text: "官方支付平台",
                link: "/zh/payment/official",
              },
              {
                text: "自定义支付渠道",
                link: "/zh/payment/custom",
              },
            ],
          },
          { text: "从机节点", link: "/zh/usage/slave-node" },
          { text: "缩略图", link: "/zh/usage/thumbnails" },
          { text: "媒体信息提取", link: "/zh/usage/media-meta" },
          { text: "离线下载", link: "/zh/usage/remote-download" },
          { text: "文件浏览应用", link: "/zh/usage/file-apps" },
          { text: "Office 文档在线编辑", link: "/zh/usage/wopi" },
          { text: "自定义前端", link: "/zh/usage/custom-frontend" },
        ],
      },
      {
        text: "维护",
        collapsed: false,
        items: [
          { text: "更新 Cloudreve", link: "/zh/maintain/upgrade" },
          { text: "从 V3 升级", link: "/zh/maintain/upgrade-from-v3" },
          { text: "升级到 Pro 版", link: "/zh/maintain/upgrade-to-pro" },
          { text: "Pro 授权管理", link: "/zh/maintain/pro-license" },
        ],
      },
      {
        text: "API",
        collapsed: false,
        items: [
          { text: "介绍", link: "/zh/api/overview" },
          { text: "认证方式", link: "/zh/api/auth" },
          { text: "Boolset 编码与解码", link: "/zh/api/boolset" },
          // { text: "缩略图链接", link: "/zh/api/thumbnail" },
          { text: "文件 URI", link: "/zh/api/file-uri" },
          { text: "元数据", link: "/zh/api/metadata" },
          // { text: "API 方法", link: "https://cloudrevev4.apifox.cn/" },
        ],
      },
    ],

    editLink: {
      pattern: "https://github.com/cloudreve/docs/blob/v4/:path",
      text: "在 GitHub 上编辑此页面",
    },

    docFooter: {
      prev: "上一页",
      next: "下一页",
    },

    outline: {
      label: "页面导航",
    },

    lastUpdated: {
      text: "最后更新于",
      formatOptions: {
        dateStyle: "short",
        timeStyle: "medium",
      },
    },

    langMenuLabel: "多语言",
    returnToTopLabel: "回到顶部",
    sidebarMenuLabel: "菜单",
    darkModeSwitchLabel: "主题",
    lightModeSwitchTitle: "切换到浅色模式",
    darkModeSwitchTitle: "切换到深色模式",
    skipToContentLabel: "跳转到内容",
  },
});

export const zhSearch: DefaultTheme.AlgoliaSearchOptions["locales"] = {
  zh: {
    placeholder: "搜索文档",
    translations: {
      button: {
        buttonText: "搜索文档",
        buttonAriaLabel: "搜索文档",
      },
      modal: {
        searchBox: {
          resetButtonTitle: "清除查询条件",
          resetButtonAriaLabel: "清除查询条件",
          cancelButtonText: "取消",
          cancelButtonAriaLabel: "取消",
        },
        startScreen: {
          recentSearchesTitle: "搜索历史",
          noRecentSearchesText: "没有搜索历史",
          saveRecentSearchButtonTitle: "保存至搜索历史",
          removeRecentSearchButtonTitle: "从搜索历史中移除",
          favoriteSearchesTitle: "收藏",
          removeFavoriteSearchButtonTitle: "从收藏中移除",
        },
        errorScreen: {
          titleText: "无法获取结果",
          helpText: "你可能需要检查你的网络连接",
        },
        footer: {
          selectText: "选择",
          navigateText: "切换",
          closeText: "关闭",
          searchByText: "搜索提供者",
        },
        noResultsScreen: {
          noResultsText: "无法找到相关结果",
          suggestedQueryText: "你可以尝试查询",
          reportMissingResultsText: "你认为该查询应该有结果？",
          reportMissingResultsLinkText: "点击反馈",
        },
      },
    },
  },
};
