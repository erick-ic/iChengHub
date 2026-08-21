'use client';

import { Loader2, Type, Link as LinkIcon, QrCode as QrCodeIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import type { QrMode } from '@/lib/qrcode/qr-service';

interface QRCodeInputProps {
  mode: QrMode;
  draft: string;
  generating: boolean;
  onModeChange: (mode: QrMode) => void;
  onDraftChange: (value: string) => void;
  onGenerate: () => void;
}

export default function QRCodeInput({
  mode,
  draft,
  generating,
  onModeChange,
  onDraftChange,
  onGenerate,
}: QRCodeInputProps) {
  const t = useTranslations('QrCode');
  // 仅用于判断空 / 全空格，payload 本身仍使用原始 draft
  const canGenerate = draft.trim() !== '';

  const tabs: Array<{ key: QrMode; label: string; icon: typeof Type }> = [
    { key: 'text', label: t('tabs.text'), icon: Type },
    { key: 'url', label: t('tabs.url'), icon: LinkIcon },
  ];

  return (
    <div className="flex flex-col gap-5">
      {/* Tabs */}
      <div role="tablist" className="inline-flex p-1 bg-gray-100 rounded-xl w-fit">
        {tabs.map(({ key, label, icon: Icon }) => {
          const active = mode === key;
          return (
            <button
              key={key}
              role="tab"
              type="button"
              aria-selected={active}
              disabled={generating}
              onClick={() => onModeChange(key)}
              className={[
                'inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                active
                  ? 'bg-white text-[#e52129] shadow-sm'
                  : 'text-gray-500 hover:text-gray-700',
                generating ? 'cursor-not-allowed opacity-60' : 'cursor-pointer',
              ].join(' ')}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          );
        })}
      </div>

      {/* Textarea */}
      <textarea
        value={draft}
        onChange={(e) => onDraftChange(e.target.value)}
        disabled={generating}
        placeholder={mode === 'text' ? t('placeholder.text') : t('placeholder.url')}
        aria-label={mode === 'text' ? t('tabs.text') : t('tabs.url')}
        spellCheck={false}
        className="w-full min-h-[180px] md:min-h-[240px] resize-y rounded-xl border border-gray-200 bg-white px-4 py-3 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#e52129]/30 focus:border-[#e52129] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
      />

      {/* Generate */}
      <button
        type="button"
        onClick={onGenerate}
        disabled={!canGenerate || generating}
        className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#e52129] text-white rounded-xl font-semibold hover:bg-red-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {generating ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            {t('generating')}
          </>
        ) : (
          <>
            <QrCodeIcon className="w-5 h-5" />
            {t('actions.generate')}
          </>
        )}
      </button>
    </div>
  );
}
