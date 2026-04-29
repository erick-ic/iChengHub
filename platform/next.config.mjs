/** @type {import('next').NextConfig} */
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

const nextConfig = {
  output: 'standalone',
  images: {
    unoptimized: true,
  },
  // 加入这个实验性选项，防止构建时尝试连接不必要的资源
  experimental: {
    workerThreads: false,
    cpus: 1
  }
};

export default withNextIntl(nextConfig);