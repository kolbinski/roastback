'use client';

import { useState } from 'react';
import type { translations } from '@/lib/i18n';
import { saveEmail } from '@/lib/api';

type Translation = (typeof translations)[keyof typeof translations];

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function EmailCapture({ t }: { t: Translation }) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<
    'idle' | 'submitting' | 'done' | 'error'
  >('idle');

  const handleSubmit = async () => {
    if (!EMAIL_REGEX.test(email)) {
      setStatus('error');
      return;
    }
    setStatus('submitting');
    const { ok } = await saveEmail({ email });
    setStatus(ok ? 'done' : 'error');
  };

  if (status === 'done') {
    return (
      <p
        className="text-sm text-center"
        style={{ color: 'var(--color-text-muted)' }}
      >
        {t.emailThanksText}
      </p>
    );
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex flex-col gap-3 w-full max-w-sm">
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder={t.emailPlaceholder}
          className="flex-1 rounded-full px-4 py-2 text-sm outline-none"
          style={{
            backgroundColor: 'var(--color-surface)',
            color: 'var(--color-text)',
            border: '1px solid var(--color-border)',
          }}
        />
        <button
          onClick={handleSubmit}
          disabled={status === 'submitting'}
          className="rounded-full px-4 py-2 text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
          style={{
            backgroundColor: 'var(--color-accent)',
            color: 'var(--color-accent-text)',
          }}
        >
          {t.emailSubmitLabel}
        </button>
      </div>
      {status === 'error' && (
        <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
          {t.emailErrorText}
        </p>
      )}
    </div>
  );
}
