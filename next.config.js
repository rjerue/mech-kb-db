const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

module.exports = (phase, defaultConfig ) => ({
  ...withBundleAnalyzer(defaultConfig),
  reactStrictMode: true,
});
