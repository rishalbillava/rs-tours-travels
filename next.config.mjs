/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: { loader: 'custom', loaderFile: './lib/image-loader.ts', deviceSizes: [640, 960, 1440, 1920], imageSizes: [320] },
};
export default nextConfig;
