import { SUPPORTED_LANGUAGES, type LanguageCode } from '@/lib/i18n';
import { DownloadSimple } from '@phosphor-icons/react';

export default function Header({
  language,
  onLanguageChange,
  showDownload,
  downloadDisabled,
  onDownload,
  onLogoClick,
}: {
  language: LanguageCode;
  onLanguageChange: (lang: LanguageCode) => void;
  showDownload: boolean;
  downloadDisabled: boolean;
  onDownload: () => void;
  onLogoClick: () => void;
}) {
  return (
    <header
      className="sticky top-0 backdrop-blur z-10"
      style={{
        backgroundColor: 'color-mix(in srgb, var(--color-bg) 90%, transparent)',
        borderBottom: '1px solid var(--color-border)',
      }}
    >
      <div className="max-w-2xl mx-auto flex items-center justify-between py-4 px-4">
        <button
          onClick={onLogoClick}
          className="flex items-center cursor-pointer"
        >
          <img src="logo-300.png" alt="RoastBack logo" width={35} height={35} />
        </button>

        {showDownload ? (
          <button
            onClick={onDownload}
            disabled={downloadDisabled}
            className="rounded-full p-2 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            style={{
              backgroundColor: 'var(--color-accent)',
              color: 'var(--color-accent-text)',
            }}
          >
            <DownloadSimple size={18} />
          </button>
        ) : (
          <select
            value={language}
            onChange={e => onLanguageChange(e.target.value as LanguageCode)}
            className="text-sm rounded-md px-3 py-2"
            style={{
              backgroundColor: 'var(--color-surface)',
              color: 'var(--color-text-muted)',
              border: '1px solid var(--color-border)',
            }}
          >
            {SUPPORTED_LANGUAGES.map(lang => (
              <option key={lang.code} value={lang.code}>
                {lang.label}
              </option>
            ))}
          </select>
        )}
      </div>
    </header>
  );
}
