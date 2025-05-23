import { defineConfig } from "vitepress";

export default defineConfig({
  lang: "en-US",
  description: "Cloudreve Documentation",
  themeConfig: {
    nav: [
      { text: "Home", link: "https://cloudreve.org/" },
      { text: "V3 Doc", link: "https://docsv3.cloudreve.org/" },
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
          {
            text: "Build from Source",
            link: "/en/overview/build",
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
              {
                text: "Alibaba Cloud OSS",
                link: "/en/usage/storage/oss",
              },
              {
                text: "Tencent Cloud COS",
                link: "/en/usage/storage/cos",
              },
              {
                text: "OneDrive or SharePoint",
                link: "/en/usage/storage/onedrive",
              },
              {
                text: "Cloudflare R2 (S3 compatible)",
                link: "/en/usage/storage/r2",
              },
              {
                text: "Google Cloud Storage (S3 compatible)",
                link: "/en/usage/storage/gcs",
              },
              {
                text: "MinIO (S3 compatible)",
                link: "/en/usage/storage/minio",
              },
              {
                text: "Backblaze B2 (S3 compatible)",
                link: "/en/usage/storage/b2",
              },
            ],
          },
          {
            collapsed: true,
            text: "Payment",
            items: [
              {
                text: "Official Payment Provider",
                link: "/en/payment/official",
              },
              {
                text: "Custom Payment Provider",
                link: "/en/payment/custom",
              },
            ],
          },
          { text: "Slave Node", link: "/en/usage/slave-node" },
          { text: "Thumbnails", link: "/en/usage/thumbnails" },
          { text: "Extract Media Metadata", link: "/en/usage/media-meta" },
          { text: "Remote Download", link: "/en/usage/remote-download" },
          { text: "File Apps", link: "/en/usage/file-apps" },
          {
            text: "Office Document Online Collaboration",
            link: "/en/usage/wopi",
          },
          { text: "Custom Frontend", link: "/en/usage/custom-frontend" },
        ],
      },
      {
        text: "Maintain",
        collapsed: false,
        items: [
          { text: "Upgrade Cloudreve", link: "/en/maintain/upgrade" },
          { text: "Upgrade from V3", link: "/en/maintain/upgrade-from-v3" },
          { text: "Upgrade to Pro", link: "/en/maintain/upgrade-to-pro" },
          { text: "Pro License Management", link: "/en/maintain/pro-license" },
        ],
      },
      {
        text: "API",
        collapsed: false,
        items: [
          { text: "Overview", link: "/en/api/overview" },
          { text: "Authentication", link: "/en/api/auth" },
          { text: "Boolset Encoding and Decoding", link: "/en/api/boolset" },
          { text: "File URI", link: "/en/api/file-uri" },
          { text: "Metadata", link: "/en/api/metadata" },
        ],
      },
    ],

    editLink: {
      pattern: "https://github.com/cloudreve/docs/blob/v4/:path",
      text: "Edit on GitHub",
    },
  },
});
