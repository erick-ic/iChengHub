/** @type {import('next').NextConfig} */
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

const nextConfig = {
  output: 'standalone',
  images: {
    unoptimized: true,
  },
  // 配置正确的基础 URL，解决重定向时连接超时问题
  basePath: '',
  assetPrefix: process.env.NODE_ENV === 'production' ? 'https://ichenghub.cn' : '',
  // 配置服务器运行时使用的 URL
  serverRuntimeConfig: {
    baseUrl: process.env.NODE_ENV === 'production' ? 'https://ichenghub.cn' : 'http://localhost:3000'
  },
  // 加入这个实验性选项，防止构建时尝试连接不必要的资源
  experimental: {
    workerThreads: false,
    cpus: 1
  }
};

export default withNextIntl(nextConfig);