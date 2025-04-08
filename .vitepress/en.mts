import { defineConfig } from "vitepress";

export default defineConfig({
  lang: "en-US",
  description: "Cloudreve Documentation",
  themeConfig: {
    nav: [
      { text: "Home", link: "https://cloudreve.org/" },
      { text: "Documentation", link: "/en" },
    ],

    sidebar: [
      {
        text: "Getting Started",
        collapsed: false,
        items: [
          { text: "Welcome", link: "/en/" },
          { text: "Quick Start", link: "/en/overview/quickstart" },
          {
            text: "Deploy",
            collapsed: true,
            link: "/en/overview/deploy/",
            items: [
              {
                text: "1. Plan Deployment",
                link: "/en/overview/deploy/",
              },
              {
                collapsed: true,
                text: "2. Deploy to Server",
                items: [
                  {
                    text: "Deploy with Docker Compose",
                    link: "/en/overview/deploy/docker-compose",
                  },
                  {
                    text: "Deploy with Docker",
                    link: "/en/overview/deploy/docker",
                  },
                  {
                    text: "Deploy with Supervisor",
                    link: "/en/overview/deploy/supervisor",
                  },
                ],
              },
              {
                text: "3. Next Steps",
                link: "/en/overview/deploy/configure",
              },
            ],
          },
          { text: "CLI", link: "/en/overview/cli" },
          { text: "Configure", link: "/en/overview/configure" },
        ],
      },
      {
        text: "Usage",
        collapsed: false,
        items: [
          { text: "Concept", link: "/en/usage/concept" },
          {
            text: "Storage",
            collapsed: true,
            link: "/en/usage/storage/",
            items: [
              {
                text: "Compare Storage Policies",
                link: "/en/usage/storage/",
              },
              {
                text: "Local",
                link: "/en/usage/storage/local",
              },
              {
                text: "Remote",
                link: "/en/usage/storage/remote",
              },
            ],
          },
          {
            text: "Custom Payment Provider",
            link: "/en/payment/custom",
          },
          { text: "Slave Node", link: "/en/usage/slave-node" },
        ],
      },
      {
        text: "Maintain",
        collapsed: false,
        items: [
          { text: "Upgrade Cloudreve", link: "/en/maintain/upgrade" },
          { text: "Upgrade from V3", link: "/en/maintain/upgrade-from-v3" },
        ],
      },
    ],
  },
});
