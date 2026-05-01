'use client';

import { useState } from 'react';
import { Heart } from 'lucide-react';

interface LikeButtonProps {
  initialLikes: number;
  isEnglish?: boolean;
}

export default function LikeButton({ initialLikes, isEnglish = false }: LikeButtonProps) {
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(initialLikes);
  const [animating, setAnimating] = useState(false);
  const [hovered, setHovered] = useState(false);

  const handleLike = () => {
    if (animating) return;
    
    setAnimating(true);
    
    if (!liked) {
      setLiked(true);
      setLikes(prev => prev + 1);
    } else {
      setLiked(false);
      setLikes(prev => Math.max(0, prev - 1));
    }
    
    setTimeout(() => setAnimating(false), 500);
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
          {liked ? (
            <Heart className={`w-5 h-5 transition-all duration-300 ${animating ? 'like-pop' : ''} ${hovered ? 'animate-heartbeat-liked' : ''}`} style={{ color: '#ec4899', fill: '#ec4899' }} />
          ) : (
            <Heart className="w-5 h-5 text-pink-500" />
          )}
          {hovered && !liked && (
            <Heart className="w-5 h-5 absolute animate-heartbeat opacity-50" style={{ color: '#ec4899', fill: '#ec4899' }} />
          )}
          {hovered && liked && (
            <Heart className="w-5 h-5 absolute animate-heartbeat-liked-secondary opacity-50" style={{ color: '#ec4899', fill: '#ec4899' }} />
          )}
        </div>
        <span className="text-zinc-500 text-sm font-medium">{isEnglish ? 'Likes' : '点赞'}</span>
      </div>
      <div className={`text-3xl font-bold text-zinc-900 transition-all duration-300 ${
        animating ? 'scale-125 text-pink-500' : ''
      }`}>
        {likes.toLocaleString()}
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