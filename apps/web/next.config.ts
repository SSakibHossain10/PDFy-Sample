import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  webpack: (config, { isServer }) => {
    //# svgr
    // Grab the existing rule that handles SVG imports
    const fileLoaderRule = config.module.rules.find((rule: { test: { test: (arg0: string) => any } }) =>
      rule.test?.test?.(".svg")
    );

    config.module.rules.push(
      // Reapply the existing rule, but only for svg imports ending in ?url
      {
        ...fileLoaderRule,
        test: /\.svg$/i,
        resourceQuery: /url/, // *.svg?url
      },
      // Convert all other *.svg imports to React components
      {
        test: /\.svg$/i,
        issuer: fileLoaderRule.issuer,
        resourceQuery: { not: [...fileLoaderRule.resourceQuery.not, /url/] }, // exclude if *.svg?url
        use: ["@svgr/webpack"],
      }
    );

    // Modify the file loader rule to ignore *.svg, since we have it handled now.
    fileLoaderRule.exclude = /\.svg$/i;

    //#pdfkit
    if (!isServer) {
      config.resolve = {
        ...config.resolve,
        symlinks: false,
        alias: {
          ...config.resolve?.alias,
          // maps fs to a virtual one allowing to register file content dynamically
          fs: path.join(__dirname, "./src/lib/pdf-kit/virtual-fs.js"),
        },
        fallback: {
          ...config.resolve?.fallback,
          // crypto module is not necessary at browser
          crypto: false,
          // fallbacks for native node libraries
          // buffer: require.resolve("buffer/"),
          // stream: require.resolve("readable-stream"),
          // zlib: require.resolve("browserify-zlib"),
          // util: require.resolve("util/"),
          // assert: require.resolve("assert/"),
        },
      };

      config.module.rules.push({ test: /\.afm$/, type: "asset/source" });
    }

    return config;
  },
  experimental: {
    staleTimes: {
      dynamic: 3000,
      static: 6000,
    },
    webpackMemoryOptimizations: true,
    // ppr: "incremental",
  },
  // transpilePackages: ["fabric"],
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
        ],
      },
      {
        source: "/sw.js",
        headers: [
          {
            key: "Content-Type",
            value: "application/javascript; charset=utf-8",
          },
          {
            key: "Cache-Control",
            value: "no-cache, no-store, must-revalidate",
          },
          {
            key: "Content-Security-Policy",
            value: "default-src 'self'; script-src 'self'",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
