import { createVanillaExtractPlugin } from '@vanilla-extract/next-plugin';

const withVanillaExtract = createVanillaExtractPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  sentry: { hideSourceMaps: true, widenClientFileUpload: true },
};

const nextPlugins = [withVanillaExtract];

export default nextPlugins.reduce((acc, plugin) => {
  if (Array.isArray(plugin)) return plugin[0](acc, plugin[1]);
  return plugin(acc);
}, nextConfig);
