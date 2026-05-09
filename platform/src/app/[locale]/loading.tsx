export default function Loading() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center w-full">
      <div className="flex flex-col items-center gap-4">
        {/* 使用品牌红色的极简旋转动画 */}
        <div className="w-8 h-8 border-4 border-gray-100 border-t-[#e52129] rounded-full animate-spin"></div>
        <p className="text-sm font-medium text-gray-400 tracking-widest uppercase">
          Loading...
        </p>
      </div>
    </div>
  );
}
