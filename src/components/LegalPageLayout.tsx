'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import { detectLanguage, type LanguageCode } from '@/lib/i18n';

export default function LegalPageLayout({
  content,
}: {
  content: Record<LanguageCode, string>;
}) {
  const [language, setLanguage] = useState<LanguageCode>('en');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setLanguage(detectLanguage());
    setReady(true);
  }, []);

  if (!ready) return null;

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: 'var(--color-bg)', color: 'var(--color-text)' }}
    >
      <div className="max-w-2xl mx-auto px-6 py-10">
        <Link
          href="/"
          className="text-sm hover:opacity-80 transition-opacity"
          style={{ color: 'var(--color-text-muted)' }}
        >
          ← RoastBack.app
        </Link>
        <article className="prose prose-invert max-w-none mt-6">
          <ReactMarkdown>{content[language]}</ReactMarkdown>
        </article>
      </div>
    </div>
  );
}
