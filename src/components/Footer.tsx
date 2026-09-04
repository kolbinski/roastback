import Link from 'next/link';
import type { translations } from '@/lib/i18n';

type Translation = (typeof translations)[keyof typeof translations];

export default function Footer({ t }: { t: Translation }) {
  return (
    <footer style={{ borderTop: '1px solid var(--color-border)' }}>
      <div
        className="max-w-2xl mx-auto flex items-center justify-between px-6 py-4 text-sm"
        style={{ color: 'var(--color-text-muted)' }}
      >
        <span>2026 &copy; RoastBack.app</span>
        <div className="flex items-center gap-6">
          <a
            href="mailto:allbeanskey@gmail.com"
            className="hover:opacity-80 transition-opacity"
            target="_blank"
          >
            {t.contactLabel}
          </a>
          <Link href="/terms" className="hover:opacity-80 transition-opacity">
            {t.termsLabel}
          </Link>
          <Link href="/privacy" className="hover:opacity-80 transition-opacity">
            {t.privacyLabel}
          </Link>
        </div>
      </div>
    </footer>
  );
}
