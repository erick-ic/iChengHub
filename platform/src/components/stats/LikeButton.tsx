'use client';

import { useState } from 'react';
import { Heart } from 'lucide-react';
import { toggleLike } from '@/app/actions/statsActions';

interface LikeButtonProps {
  promptId: string;
  initialLiked: boolean;
  initialCount: number;
  isEnglish?: boolean;
}

export default function LikeButton({ 
  promptId, 
  initialLiked, 
  initialCount, 
  isEnglish = false 
}: LikeButtonProps) {
  const [isLiked, setIsLiked] = useState(initialLiked);
  const [likesCount, setLikesCount] = useState(initialCount);
  const [isAnimating, setIsAnimating] = useState(false);
  const [hovered, setHovered] = useState(false);

  const handleLike = async () => {
    if (isAnimating) return;

    setIsAnimating(true);

    const prevLiked = isLiked;
    const prevCount = likesCount;

    setIsLiked(!prevLiked);
    setLikesCount(prevLiked ? prevCount - 1 : prevCount + 1);

    try {
      const result = await toggleLike(promptId);
      
      if (!result.success) {
        setIsLiked(prevLiked);
        setLikesCount(prevCount);
        console.error('点赞失败:', result.message);
        alert(result.message || '操作失败，请重试');
      }
    } catch (error) {
      setIsLiked(prevLiked);
      setLikesCount(prevCount);
      console.error('点赞请求失败:', error);
      alert('网络错误，请重试');
    } finally {
      setIsAnimating(false);
    }
  };

  return (
    <div 
      className="flex-1 bg-white/80 backdrop-blur-md border border-white/40 rounded-2xl p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
      onClick={handleLike}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-pink-50 to-pink-100 flex items-center justify-center">
          <Heart 
            className={`w-5 h-5 transition-all duration-300 ${
              isAnimating ? 'like-pop' : ''
            } ${hovered && isLiked ? 'animate-heartbeat-liked' : ''} ${isLiked ? 'text-red-500' : 'text-pink-500'}`}
            fill={isLiked ? 'currentColor' : 'none'}
          />
          {hovered && !isLiked && (
            <Heart className="w-5 h-5 text-pink-400 absolute animate-heartbeat opacity-50" fill="currentColor" />
          )}
          {hovered && isLiked && (
            <Heart className="w-5 h-5 text-red-400 absolute animate-heartbeat-liked-secondary opacity-50" fill="currentColor" />
          )}
        </div>
        <span className="text-zinc-500 text-sm font-medium">{isEnglish ? 'Likes' : '点赞'}</span>
      </div>
      <div className={`text-3xl font-bold text-zinc-900 transition-all duration-300 ${
        isAnimating ? 'scale-125 text-red-500' : ''
      }`}>
        {likesCount.toLocaleString()}
      </div>
      <style>{`
        @keyframes heartbeat {
          0% { transform: scale(1); opacity: 0.5; }
          50% { transform: scale(1.5); opacity: 0.8; }
          100% { transform: scale(2); opacity: 0; }
        }
        @keyframes heartbeat-liked {
          0% { transform: scale(1); }
          50% { transform: scale(1.15); }
          100% { transform: scale(1); }
        }
        @keyframes heartbeat-liked-secondary {
          0% { transform: scale(1); opacity: 0.5; }
          50% { transform: scale(1.3); opacity: 0.7; }
          100% { transform: scale(1.6); opacity: 0; }
        }
        @keyframes like-pop {
          0% { transform: scale(1); }
          30% { transform: scale(1.3); }
          50% { transform: scale(0.9); }
          70% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }
        .animate-heartbeat {
          animation: heartbeat 0.6s ease-in-out infinite;
        }
        .animate-heartbeat-liked {
          animation: heartbeat-liked 0.5s ease-in-out infinite;
        }
        .animate-heartbeat-liked-secondary {
          animation: heartbeat-liked-secondary 0.6s ease-in-out infinite;
        }
        .like-pop {
          animation: like-pop 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}