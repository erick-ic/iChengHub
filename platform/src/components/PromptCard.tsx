'use client';

import Image from 'next/image';
import { Copy, Check, Eye, Heart, MessageCircle } from 'lucide-react';
import { useState } from 'react';

export interface PromptData {
  id: string;
  imageUrl: string;
  title: string;
  category: string;
  promptText: string;
  views: number;
  likes: number;
  comments: number;
}

export default function PromptCard({ data }: { data: PromptData }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(data.promptText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      <div className="relative w-full aspect-video bg-gray-50 border-b border-gray-50">
        <Image
          src={data.imageUrl}
          alt={data.title}
          fill
          className="object-cover"
          unoptimized
        />
      </div>

      <div className="p-5 flex flex-col flex-grow gap-4">
        <div className="flex justify-between items-center">
          <div className="flex flex-col">
            <h3 className="text-lg font-bold text-gray-900 truncate">{data.title}</h3>
            <span className="text-xs text-gray-500 mt-0.5">{data.category}</span>
          </div>
          <button
            onClick={handleCopy}
            className={`p-2 rounded-full transition-colors flex-shrink-0 ${
              copied ? 'bg-green-50 text-green-600' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
            }`}
            title="一键复制提示词"
          >
            {copied ? <Check size={18} /> : <Copy size={18} />}
          </button>
        </div>

        <div className="relative bg-gray-50 rounded-xl p-3 h-28 overflow-y-auto text-sm text-gray-700 leading-relaxed border border-gray-100">
          {data.promptText}
        </div>

        <div className="flex items-center justify-between mt-2 pt-4 border-t border-gray-50 text-gray-400 text-sm">
          <div className="flex gap-4">
            <div className="flex items-center gap-1.5 hover:text-gray-900 transition-colors cursor-pointer">
              <Eye size={16} />
              <span>{data.views}</span>
            </div>
            <div className="flex items-center gap-1.5 hover:text-red-500 transition-colors cursor-pointer">
              <Heart size={16} />
              <span>{data.likes}</span>
            </div>
            <div className="flex items-center gap-1.5 hover:text-blue-500 transition-colors cursor-pointer">
              <MessageCircle size={16} />
              <span>{data.comments}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}