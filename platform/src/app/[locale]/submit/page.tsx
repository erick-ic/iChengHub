'use client';

import { useState, useEffect } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { useTranslations } from 'next-intl';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { submitRecommendation, submitDemand } from '@/app/actions/submit-center';

interface SubmitState {
  success: boolean;
  error?: string;
}

const initialState: SubmitState = { success: false };

interface FormData {
  // Tool submission fields
  name: string;
  url: string;
  description: string;
  contact: string;
  // Demand fields
  title: string;
  detail: string;
  referenceUrl: string;
}

function SubmitButton({ mode, t }: { mode: 'TOOL' | 'DEMAND'; t: ReturnType<typeof useTranslations> }) {
  const { pending } = useFormStatus();
  
  return (
    <button
      type="submit"
      disabled={pending}
      className={`w-full py-3.5 rounded-lg font-medium text-sm transition-all mt-6 flex items-center justify-center gap-2 ${
        pending
          ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
          : 'bg-[#e52129] text-white hover:bg-[#d11a22] active:bg-[#b8161f]'
      }`}
    >
      {pending ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          {t('submitting')}
        </>
      ) : (
        mode === 'TOOL' ? t('submitTool') : t('submitDemand')
      )}
    </button>
  );
}

interface ConfettiProps {
  show: boolean;
}

function Confetti({ show }: ConfettiProps) {
  if (!show) return null;

  const colors = ['#e52129', '#ff6b6b', '#ffd93d', '#6bcb77', '#4d96ff', '#ff9ff3', '#54a0ff'];
  const confettiCount = 50;

  const confetti = Array.from({ length: confettiCount }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 0.5,
    duration: 1.5 + Math.random() * 1,
    color: colors[Math.floor(Math.random() * colors.length)],
    size: 8 + Math.random() * 8,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
      {confetti.map((c) => (
        <div
          key={c.id}
          className="absolute top-0 rounded-full animate-fall"
          style={{
            left: `${c.left}%`,
            width: `${c.size}px`,
            height: `${c.size}px`,
            backgroundColor: c.color,
            animationDelay: `${c.delay}s`,
            animationDuration: `${c.duration}s`,
          }}
        />
      ))}
      <style>{`
        @keyframes fall {
          0% {
            transform: translateY(-10px) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
        .animate-fall {
          animation: fall linear forwards;
        }
      `}</style>
    </div>
  );
}

export default function SubmitPage() {
  const t = useTranslations('submitPage');
  const [mode, setMode] = useState<'TOOL' | 'DEMAND'>('TOOL');
  const [showSuccess, setShowSuccess] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // 受控表单数据
  const [formData, setFormData] = useState<FormData>({
    name: '',
    url: '',
    description: '',
    contact: '',
    title: '',
    detail: '',
    referenceUrl: '',
  });

  const [toolState, toolAction] = useFormState(submitRecommendation, initialState);
  const [demandState, demandAction] = useFormState(submitDemand, initialState);

  const currentAction = mode === 'TOOL' ? toolAction : demandAction;
  const currentState = mode === 'TOOL' ? toolState : demandState;

  // 处理表单字段变化
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // 重置表单数据
  const resetForm = () => {
    setFormData({
      name: '',
      url: '',
      description: '',
      contact: '',
      title: '',
      detail: '',
      referenceUrl: '',
    });
  };

  // 处理提交结果
  useEffect(() => {
    // 清除之前的错误
    setError(null);

    if (currentState.success) {
      // 显示成功效果
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);

      setTimeout(() => {
        setShowSuccess(true);
        resetForm();
        
        // 重置状态以便下次提交
        if (mode === 'TOOL') {
          toolAction(new FormData());
        } else {
          demandAction(new FormData());
        }
      }, 100);

      // 3秒后隐藏成功提示
      const timer = setTimeout(() => setShowSuccess(false), 3000);
      return () => clearTimeout(timer);
    } else if (currentState.error) {
      // 显示错误信息
      setError(currentState.error);
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [currentState, mode, toolAction, demandAction]);

  // 切换模式时重置表单
  useEffect(() => {
    resetForm();
    setShowSuccess(false);
    setError(null);
  }, [mode]);

  return (
    <>
      <Confetti show={showConfetti} />
      <div className="min-h-screen bg-[#f5f5f7] py-12 px-4">
        <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-sm p-6 sm:p-10">
          {/* 顶部切换器 */}
          <div className="bg-[#f5f5f7] p-1 rounded-lg flex mb-8">
            <button
              type="button"
              onClick={() => setMode('TOOL')}
              className={`flex-1 py-2.5 text-sm font-medium rounded-md transition-all ${
                mode === 'TOOL'
                  ? 'bg-white text-[#e52129] shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {t('tabTool')}
            </button>
            <button
              type="button"
              onClick={() => setMode('DEMAND')}
              className={`flex-1 py-2.5 text-sm font-medium rounded-md transition-all ${
                mode === 'DEMAND'
                  ? 'bg-white text-[#e52129] shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {t('tabDemand')}
            </button>
          </div>

          {/* 标题 */}
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {mode === 'TOOL' ? t('toolTitle') : t('demandTitle')}
          </h1>
          <p className="text-gray-500 text-sm mb-8">
            {mode === 'TOOL' ? t('toolSubtitle') : t('demandSubtitle')}
          </p>

          {/* 错误提示 */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
              <span className="text-sm text-red-700">{error}</span>
            </div>
          )}

          {/* 表单 */}
          <form id="submit-form" action={currentAction} className="space-y-5">
            {mode === 'TOOL' ? (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    {t('toolNameLabel')} <span className="text-[#e52129]">{t('required')}</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    placeholder={t('toolNamePlaceholder')}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#e52129]/20 focus:border-[#e52129] transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    {t('urlLabel')} <span className="text-[#e52129]">{t('required')}</span>
                  </label>
                  <input
                    type="text"
                    name="url"
                    value={formData.url}
                    onChange={handleInputChange}
                    required
                    placeholder={t('urlPlaceholder')}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#e52129]/20 focus:border-[#e52129] transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    {t('descriptionLabel')} <span className="text-[#e52129]">{t('required')}</span>
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    rows={3}
                    placeholder={t('descriptionPlaceholder')}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#e52129]/20 focus:border-[#e52129] transition-all resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    {t('contactLabel')} <span className="text-gray-400 font-normal">（{t('contactOptional')}）</span>
                  </label>
                  <input
                    type="text"
                    name="contact"
                    value={formData.contact}
                    onChange={handleInputChange}
                    placeholder={t('contactToolPlaceholder')}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#e52129]/20 focus:border-[#e52129] transition-all"
                  />
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    {t('titleLabel')} <span className="text-[#e52129]">{t('required')}</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    placeholder={t('titlePlaceholder')}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#e52129]/20 focus:border-[#e52129] transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    {t('detailLabel')} <span className="text-[#e52129]">{t('required')}</span>
                  </label>
                  <textarea
                    name="detail"
                    value={formData.detail}
                    onChange={handleInputChange}
                    required
                    rows={4}
                    placeholder={t('detailPlaceholder')}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#e52129]/20 focus:border-[#e52129] transition-all resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    {t('referenceUrlLabel')} <span className="text-gray-400 font-normal">（{t('contactOptional')}）</span>
                  </label>
                  <input
                    type="text"
                    name="referenceUrl"
                    value={formData.referenceUrl}
                    onChange={handleInputChange}
                    placeholder={t('referenceUrlPlaceholder')}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#e52129]/20 focus:border-[#e52129] transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    {t('contactLabel')} <span className="text-gray-400 font-normal">（{t('contactOptional')}）</span>
                  </label>
                  <input
                    type="text"
                    name="contact"
                    value={formData.contact}
                    onChange={handleInputChange}
                    placeholder={t('contactDemandPlaceholder')}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#e52129]/20 focus:border-[#e52129] transition-all"
                  />
                </div>
              </>
            )}

            {/* 提交按钮 */}
            <SubmitButton mode={mode} t={t} />

            {/* 成功提示 */}
            {showSuccess && (
              <div className="text-center text-sm py-3 bg-green-50 border border-green-200 rounded-lg flex items-center justify-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-green-700">{mode === 'TOOL' ? t('toolSuccess') : t('demandSuccess')}</span>
              </div>
            )}
          </form>
        </div>
      </div>
    </>
  );
}
