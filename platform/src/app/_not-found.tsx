import { Link } from '@/navigation';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">
      <div className="text-center">
        <div className="text-6xl font-bold text-gray-900 mb-4">404</div>
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">页面未找到</h1>
        <p className="text-gray-500 mb-6">抱歉，您访问的页面不存在</p>
        <Link
          href="/"
          className="inline-flex items-center px-4 py-2 bg-foreground text-background rounded-full hover:opacity-90 transition-opacity"
        >
          返回首页
        </Link>
      </div>
    </div>
  );
}
