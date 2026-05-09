'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Search, X, ExternalLink } from 'lucide-react';
import { useDebouncedCallback } from 'use-debounce';
import { ToolIcon } from '../ui/ToolIcon';

export interface SearchItem {
  id: string;
  title: string;
  titleEn: string | null;
  description: string;
  descriptionEn: string | null;
  url: string;
  iconUrl?: string;
  category: string;
  type: 'tool' | 'link' | 'prompt';
}

interface GlobalSearchProps {
  items: SearchItem[];
  isEnglish: boolean;
}

export function GlobalSearch({ items, isEnglish }: GlobalSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isMobileExpanded, setIsMobileExpanded] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 过滤搜索结果
  const debouncedSearch = useDebouncedCallback((searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    const filteredResults = items
      .filter(item => {
        const title = isEnglish ? (item.titleEn || item.title) : item.title;
        return title.toLowerCase().includes(searchQuery.toLowerCase());
      })
      .slice(0, 10);

    setResults(filteredResults);
  }, 300);

  // 监听输入变化
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setIsOpen(true);
    debouncedSearch(value);
  }, [debouncedSearch]);

  // 点击外部关闭下拉框
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setIsMobileExpanded(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 打开时聚焦输入框
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // 清空搜索
  const handleClear = () => {
    setQuery('');
    setResults([]);
    inputRef.current?.focus();
  };

  // 点击搜索结果跳转
  const handleResultClick = (url: string) => {
    // 判断是否为外部链接（包含协议）
    const isExternal = url.startsWith('http://') || url.startsWith('https://');
    
    if (isExternal) {
      // 外部链接，在新窗口打开
      window.open(url, '_blank');
    } else {
      // 站内链接，在当前页面导航
      window.location.href = url;
    }
    
    setIsOpen(false);
    setIsMobileExpanded(false);
    setQuery('');
    setResults([]);
  };

  // 处理键盘事件
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // 按 Enter 键打开第一个搜索结果
    if (e.key === 'Enter') {
      e.preventDefault();
      console.log('Enter pressed, results length:', results.length);
      if (results.length > 0) {
        handleResultClick(results[0].url);
      }
    }
  };

  // 按类型分组结果
  const groupedResults = results.reduce((acc, item) => {
    if (!acc[item.type]) {
      acc[item.type] = [];
    }
    acc[item.type].push(item);
    return acc;
  }, {} as Record<string, SearchItem[]>);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* 移动端：搜索框 + 结果列表 */}
      <div className="md:hidden">
        {/* 搜索框 */}
        <div className="flex items-center gap-3 px-4 py-3 rounded-full bg-[#f5f5f7]">
          <Search className="w-4 h-5 text-gray-400" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder={isEnglish ? 'Search...' : '搜索...'}
            className="flex-1 bg-transparent text-base outline-none placeholder:text-gray-400"
          />
          {query && (
            <button onClick={handleClear} className="text-gray-400 hover:text-gray-600">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* 移动端搜索结果列表 */}
        {query && (
          <div className="mt-2 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden max-h-64 overflow-y-auto">
            {results.length > 0 ? (
              <div>
                {results.slice(0, 8).map((item) => {
                  const title = isEnglish ? (item.titleEn || item.title) : item.title;
                  const description = isEnglish ? (item.descriptionEn || item.description) : item.description;
                  
                  return (
                      <button
                        key={item.id}
                        onClick={() => handleResultClick(item.url)}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
                      >
                        <ToolIcon url={item.url} title={title} iconUrl={item.iconUrl} />
                        <div className="flex-1 min-w-0">
                          <span className="font-medium text-gray-900 truncate block">
                            {title}
                          </span>
                          <p className="text-sm text-gray-500 truncate mt-0.5">
                            {description}
                          </p>
                        </div>
                        <ExternalLink className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      </button>
                    );
                  })}
              </div>
            ) : (
              <div className="py-6 px-4 text-center">
                <p className="text-sm text-gray-500">
                  {isEnglish ? 'No results found' : '未找到相关结果'}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {isEnglish ? 'Try a different keyword' : '请尝试其他关键词'}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 桌面端：完整搜索框 */}
      <div className="hidden md:block">
        {/* 搜索框 */}
        <div
          className={`
            flex items-center gap-3 px-4 py-2.5 rounded-full cursor-pointer
            transition-all duration-200 w-64 md:w-72
            ${isOpen ? 'bg-white shadow-lg ring-2 ring-primary/20' : 'bg-[#f5f5f7] hover:bg-gray-200'}
          `}
          onClick={() => setIsOpen(!isOpen)}
        >
          <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder={isEnglish ? 'Search...' : '搜索...'}
            className="bg-transparent text-sm outline-none flex-1 placeholder:text-gray-400"
            onClick={(e) => e.stopPropagation()}
          />
          {query && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleClear();
              }}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* 下拉搜索结果 - 仅桌面端显示 */}
        {isOpen && (
          <div className={`
            absolute top-full mt-2 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50
            w-80
          `}>
            {/* 搜索结果列表 */}
            {results.length > 0 ? (
              <div className="max-h-80 overflow-y-auto">
                {/* 按类型分组显示 */}
                {Object.entries(groupedResults).map(([type, items]) => (
                  <div key={type} className="border-b border-gray-50 last:border-b-0">
                    {/* 分组标题 */}
                    <div className="px-4 py-2 bg-gray-50/50">
                      <span className={`text-xs font-medium ${
                        type === 'tool' ? 'text-blue-600' : 
                        type === 'prompt' ? 'text-purple-600' : 'text-green-600'
                      }`}>
                        {isEnglish 
                          ? (type === 'tool' ? 'Tools' : type === 'prompt' ? 'Prompts' : 'Links') 
                          : (type === 'tool' ? '工具' : type === 'prompt' ? '提示词' : '链接')
                        } ({items.length})
                      </span>
                    </div>
                    
                    {/* 分组内容 */}
                    {items.map((item) => {
                      const title = isEnglish ? (item.titleEn || item.title) : item.title;
                      const description = isEnglish ? (item.descriptionEn || item.description) : item.description;
                      
                      return (
                        <button
                          key={item.id}
                          onClick={() => handleResultClick(item.url)}
                          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
                        >
                          {/* 图标 */}
                          <ToolIcon url={item.url} title={title} iconUrl={item.iconUrl} />
                          
                          {/* 文字内容 */}
                          <div className="flex-1 min-w-0">
                            <span className="font-medium text-gray-900 truncate block">
                              {title}
                            </span>
                            <p className="text-sm text-gray-500 truncate mt-0.5">
                              {description}
                            </p>
                          </div>
                          
                          {/* 外部链接图标 */}
                          <ExternalLink className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>
            ) : (
              /* 无结果提示 */
              <div className="py-8 px-4">
                {query ? (
                  <div className="text-center">
                    <p className="text-sm text-gray-500">
                      {isEnglish ? 'No results found' : '未找到相关结果'}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {isEnglish ? 'Try a different keyword' : '请尝试其他关键词'}
                    </p>
                  </div>
                ) : (
                  <div className="text-center">
                    <p className="text-sm text-gray-500">
                      {isEnglish ? 'Search tools and links' : '搜索工具和链接'}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}