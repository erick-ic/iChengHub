import { ToolCard } from '@/components/ToolCard';

const mockTools = [
  {
    id: '1',
    name: 'JSON 转换',
    description: '快速格式化、验证和转换 JSON 数据，支持多种编程语言格式',
    iconUrl: 'json',
    url: '#',
    category: '开发工具'
  },
  {
    id: '2',
    name: '图片压缩',
    description: '智能压缩图片文件，保持画质的同时大幅减小文件体积',
    iconUrl: 'image',
    url: '#',
    category: '媒体处理'
  },
  {
    id: '3',
    name: '正则测试',
    description: '在线测试和调试正则表达式，支持多种编程语言语法',
    iconUrl: 'search',
    url: '#',
    category: '开发工具'
  },
  {
    id: '4',
    name: '文本对比',
    description: '智能对比两个文本文件的差异，高亮显示修改内容',
    iconUrl: 'text',
    url: '#',
    category: '文本处理'
  },
  {
    id: '5',
    name: '代码格式化',
    description: '自动格式化代码，支持多种编程语言和代码风格',
    iconUrl: 'settings',
    url: '#',
    category: '开发工具'
  },
  {
    id: '6',
    name: '快速计算',
    description: '科学计算器，支持复杂数学运算和单位转换',
    iconUrl: 'zap',
    url: '#',
    category: '实用工具'
  }
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* 顶部标题栏 */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200/60 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">AI 工具门户</h1>
              <p className="text-sm text-gray-600 mt-1">发现优质在线工具</p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                登录
              </button>
              <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:shadow-lg transition-all">
                注册
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 主要内容区域 */}
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            精选在线工具
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            为您精心挑选的实用在线工具，提升工作效率和开发体验
          </p>
        </div>
        
        {/* 工具卡片网格 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockTools.map((tool) => (
            <ToolCard
              key={tool.id}
              id={tool.id}
              name={tool.name}
              description={tool.description}
              iconUrl={tool.iconUrl}
              url={tool.url}
              category={tool.category}
            />
          ))}
        </div>

        {/* 底部提示 */}
        <div className="text-center mt-12">
          <p className="text-gray-500 text-sm">
            更多工具正在开发中，敬请期待...
          </p>
        </div>
      </main>
    </div>
  );
}