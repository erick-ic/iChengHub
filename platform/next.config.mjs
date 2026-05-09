/** @type {import('next').NextConfig} */
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

const nextConfig = {
  output: 'standalone',
  images: {
    unoptimized: true,
  },
  // 保持 basePath 为空，不干扰重定向
  basePath: '',
  // 加入这个实验性选项，防止构建时连接不必要的资源
  experimental: {
    workerThreads: false,
    cpus: 1
  }
};

export default withNextIntl(nextConfig);