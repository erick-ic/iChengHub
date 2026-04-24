'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { cn } from '@/lib/utils';
import { ArrowRight, Code, Image, FileText, Search, Settings, Zap } from 'lucide-react';

interface ToolCardProps {
  id: string;
  name: string;
  description: string;
  iconUrl: string;
  url: string;
  category: string;
}

const iconMap: Record<string, React.ComponentType<any>> = {
  'json': Code,
  'image': Image,
  'text': FileText,
  'search': Search,
  'settings': Settings,
  'zap': Zap
};

export function ToolCard({ name, description, iconUrl, url, category }: ToolCardProps) {
  const IconComponent = iconMap[iconUrl] || Zap;
  
  return (
    <Card 
      className={cn(
        "group cursor-pointer transition-all duration-300",
        "hover:-translate-y-1 hover:shadow-xl",
        "border border-gray-200/60 bg-white/80 backdrop-blur-sm",
        "rounded-xl overflow-hidden"
      )}
      onClick={() => window.open(url, '_blank')}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 text-white">
              <IconComponent className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-base font-semibold text-gray-900">
                {name}
              </CardTitle>
            </div>
          </div>
          <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
        </div>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-sm text-gray-600 line-clamp-2">
          {description}
        </CardDescription>
      </CardContent>
    </Card>
  );
}