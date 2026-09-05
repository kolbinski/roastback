'use client';

import { useState } from 'react';
import type { translations } from '@/lib/i18n';

type Translation = (typeof translations)[keyof typeof translations];

export default function DownloadModal({
  t,
  onConfirm,
  onCancel,
}: {
  t: Translation;
  onConfirm: (width: number) => void;
  onCancel: () => void;
}) {
  const [width, setWidth] = useState<number | null>(null);

  return (
    <div
      className="fixed inset-0 z-20 flex items-center justify-center px-6"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}
      onClick={onCancel}
    >
      <div
        className="w-full max-w-sm rounded-2xl p-6 space-y-4"
        style={{
          backgroundColor: 'var(--color-surface)',
          color: 'var(--color-text)',
        }}
        onClick={e => e.stopPropagation()}
      >
        <p className="font-semibold">{t.downloadModalTitle}</p>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="download-width"
            checked={width === 420}
            onChange={() => setWidth(420)}
          />
          {t.downloadMobileOption}
        </label>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="download-width"
            checked={width === 700}
            onChange={() => setWidth(700)}
          />
          {t.downloadDesktopOption}
        </label>

        <div className="flex justify-end gap-3 pt-2">
          <button
            onClick={onCancel}
            className="text-sm"
            style={{ color: 'var(--color-text-muted)' }}
          >
            {t.cancelLabel}
          </button>
          <button
            onClick={() => width && onConfirm(width)}
            disabled={width === null}
            className="rounded-full px-4 py-2 text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
              backgroundColor: 'var(--color-accent)',
              color: 'var(--color-accent-text)',
            }}
          >
            {t.downloadConfirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
