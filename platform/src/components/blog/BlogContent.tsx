'use client';

import ReactMarkdown from 'react-markdown';
import { Copy, Check } from 'lucide-react';
import { useState } from 'react';
import React from 'react';

interface BlogContentProps {
  content: string;
}

function CodeBlock({ children, className, ...props }: any) {
  const [copied, setCopied] = useState(false);
  const code = String(children).replace(/\n$/, '');

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  return (
    <div className="relative group my-6">
      <div className="bg-[#1e1e1e] rounded-xl overflow-hidden">
        <pre className="p-4 md:p-6 text-sm md:text-base overflow-x-auto">
          <code className={className} {...props}>
            {children}
          </code>
        </pre>
      </div>
      <button
        onClick={handleCopy}
        className="absolute top-3 right-3 flex items-center gap-2 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-gray-400 hover:text-white rounded-lg transition-all duration-200 backdrop-blur-sm"
        aria-label="Copy code"
      >
        {copied ? (
          <>
            <Check className="h-4 w-4 text-green-400" />
            <span className="text-xs text-green-400">已复制</span>
          </>
        ) : (
          <>
            <Copy className="h-4 w-4" />
            <span className="text-xs opacity-0 group-hover:opacity-100 transition-opacity">复制</span>
          </>
        )}
      </button>
    </div>
  );
}

export default function BlogContent({ content }: BlogContentProps) {
  return (
    <div className="prose prose-slate dark:prose-invert max-w-none">
      <ReactMarkdown
        components={{
          code({ node, inline, className, children, ...props }: any) {
            if (inline) {
              return (
                <code
                  className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 px-1.5 py-0.5 rounded text-sm font-normal mx-0.5 border border-gray-200/50 dark:border-gray-700/30"
                  {...props}
                >
                  {children}
                </code>
              );
            }
            return <CodeBlock className={className} {...props}>{children}</CodeBlock>;
          },
          h2({ children, ...props }: any) {
            const text = Array.isArray(children) ? children.join('') : String(children);
            const id = text
              .toLowerCase()
              .replace(/[^\w\s-]/g, '')
              .replace(/\s+/g, '-')
              .replace(/-+/g, '-')
              .trim();
            return (
              <h2 id={id} className="border-l-4 border-[#e52129] pl-3 font-bold text-gray-900 dark:text-white mt-8 mb-4" {...props}>
                {children}
              </h2>
            );
          },
          h3({ children, ...props }: any) {
            const text = Array.isArray(children) ? children.join('') : String(children);
            const id = text
              .toLowerCase()
              .replace(/[^\w\s-]/g, '')
              .replace(/\s+/g, '-')
              .replace(/-+/g, '-')
              .trim();
            return (
              <h3 id={id} className="font-bold text-gray-900 dark:text-white mt-6 mb-3" {...props}>
                {children}
              </h3>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}