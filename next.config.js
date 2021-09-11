const CopyPlugin = require("copy-webpack-plugin");

const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

module.exports = (phase, defaultConfig) => ({
  ...withBundleAnalyzer(defaultConfig),
  reactStrictMode: true,
  webpack5: true,
  webpack: function (config, { dev, isServer }) {
    // Fixes npm packages that depend on `fs` module
    if (!isServer) {
      config.resolve.fallback.fs = false;
    }
    // copy files you're interested in
    if (!dev) {
      config.plugins.push(
        new CopyPlugin({
          patterns: [{ from: "data/", to: "data/" }],
        })
      );
    }

    return config;
  },
});
