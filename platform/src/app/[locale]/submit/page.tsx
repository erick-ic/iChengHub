'use client';

import { useState, useEffect } from 'react';
import { useFormState } from 'react-dom';
import { useTranslations } from 'next-intl';
import { Loader2 } from 'lucide-react';
import { submitRecommendation, submitDemand } from '@/app/actions/submit-center';

const initialState = { success: false };

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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [toolState, toolAction] = useFormState(submitRecommendation, initialState);
  const [demandState, demandAction] = useFormState(submitDemand, initialState);

  const currentAction = mode === 'TOOL' ? toolAction : demandAction;
  const currentState = mode === 'TOOL' ? toolState : demandState;

  const handleSubmit = () => {
    setShowSuccess(false);
    setIsSubmitting(true);
  };

  useEffect(() => {
    if (currentState.success || (!currentState.success && isSubmitting)) {
      setIsSubmitting(false);
    }
  }, [currentState.success, isSubmitting]);

  useEffect(() => {
    if (currentState.success && !showSuccess) {
      setShowConfetti(true);
      setTimeout(() => {
        setShowConfetti(false);
      }, 3000);
      setTimeout(() => {
        setShowSuccess(true);
        const form = document.getElementById('submit-form') as HTMLFormElement;
        form?.reset();
      }, 100);
    }
  }, [currentState.success, showSuccess]);

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

          {/* 表单 */}
          <form id="submit-form" action={currentAction} onSubmit={handleSubmit} className="space-y-5">
            {mode === 'TOOL' ? (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    {t('toolNameLabel')} <span className="text-[#e52129]">{t('required')}</span>
                  </label>
                  <input
                    type="text"
                    name="name"
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
                    placeholder={t('contactDemandPlaceholder')}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#e52129]/20 focus:border-[#e52129] transition-all"
                  />
                </div>
              </>
            )}

            {/* 提交按钮 */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3.5 rounded-lg font-medium text-sm transition-all mt-6 flex items-center justify-center gap-2 ${
                isSubmitting
                  ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                  : 'bg-[#e52129] text-white hover:bg-[#d11a22]'
              }`}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {t('submitting')}
                </>
              ) : (
                mode === 'TOOL' ? t('submitTool') : t('submitDemand')
              )}
            </button>

            {/* 提示消息 */}
            {showSuccess && (
              <div className="text-center text-sm py-2 text-green-600">
                {mode === 'TOOL' ? t('toolSuccess') : t('demandSuccess')}
              </div>
            )}
          </form>
        </div>
      </div>
    </>
  );
}
