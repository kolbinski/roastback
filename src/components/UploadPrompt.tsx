import type { translations } from '@/lib/i18n';

type Translation = (typeof translations)[keyof typeof translations];

export default function UploadPrompt({
  t,
  onFileChange,
}: {
  t: Translation;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className="max-w-2xl text-center space-y-8">
      <p
        className="text-lg font-serif"
        style={{ color: 'var(--color-text-muted)' }}
      >
        {t.heroCopy}
      </p>
      <input
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        id="photo-input"
        onChange={onFileChange}
      />
      <label
        htmlFor="photo-input"
        className="inline-block font-semibold px-8 py-4 rounded-full text-lg hover:opacity-90 transition-opacity cursor-pointer"
        style={{
          backgroundColor: 'var(--color-accent)',
          color: 'var(--color-accent-text)',
        }}
      >
        {t.buttonLabel}
      </label>
    </div>
  );
}
