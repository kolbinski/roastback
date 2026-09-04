'use client';

import { useRef } from 'react';
import { toPng } from 'html-to-image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import LoadingScreen from '@/components/LoadingScreen';
import UploadPrompt from '@/components/UploadPrompt';
import MessageBubble from '@/components/MessageBubble';
import ReactionButtons from '@/components/ReactionButtons';
import ArgueBar from '@/components/ArgueBar';
import EmailCapture from '@/components/EmailCapture';
import { useRoastback } from '@/hooks/useRoastback';

export default function Home() {
  const {
    language,
    setLanguage,
    ready,
    t,
    photoBase64,
    loading,
    messages,
    errorType,
    retryFn,
    showArgueBar,
    setShowArgueBar,
    argueMessage,
    setArgueMessage,
    setArgueBarPlaceholder,
    argueBarPlaceholder,
    threadClosed,
    handleFileChange,
    handleArgueSubmit,
    resetSession,
  } = useRoastback();

  const contentRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    if (!contentRef.current) return;
    const el = contentRef.current;
    const previousWidth = el.style.width;

    el.style.width = '672px';

    const dataUrl = await toPng(el, {
      backgroundColor: '#1F1B19',
      pixelRatio: 2,
    });

    el.style.width = previousWidth;

    const link = document.createElement('a');
    link.download = 'roastback.png';
    link.href = dataUrl;
    link.click();
  };

  if (!ready) return <LoadingScreen />;

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: 'var(--color-bg)', color: 'var(--color-text)' }}
    >
      <Header
        language={language}
        onLanguageChange={setLanguage}
        showDownload={!!photoBase64}
        downloadDisabled={loading || !!errorType}
        onDownload={handleDownload}
        onLogoClick={resetSession}
      />

      <main className="flex-1 flex flex-col items-center justify-center pb-32">
        {!photoBase64 ? (
          <UploadPrompt t={t} onFileChange={handleFileChange} />
        ) : (
          <div className="max-w-2xl w-full space-y-4">
            <div ref={contentRef} className="space-y-4 py-4 px-4">
              <MessageBubble message={{ role: 'user', text: t.userBubble }} />
              <img
                src={`data:image/jpeg;base64,${photoBase64}`}
                alt="Selected"
                className="w-full"
              />

              {messages.map((m, i) => (
                <MessageBubble key={i} message={m} />
              ))}

              {loading && (
                <p
                  className="font-serif text-center animate-pulse"
                  style={{ color: 'var(--color-text-muted)' }}
                >
                  {t.loadingText}
                </p>
              )}
            </div>

            {errorType === 'moderation' && (
              <p
                className="font-serif text-center"
                style={{ color: 'var(--color-text-muted)' }}
              >
                {t.moderationErrorText}
              </p>
            )}

            {errorType === 'closed' && (
              <div className="space-y-3">
                <p
                  className="font-serif text-center"
                  style={{ color: 'var(--color-text-muted)' }}
                >
                  {t.spendCapErrorText}
                </p>
                <EmailCapture t={t} />
              </div>
            )}

            {errorType === 'generic' && (
              <p
                className="font-serif text-center"
                style={{ color: 'var(--color-text-muted)' }}
              >
                {t.errorText}{' '}
                <button
                  onClick={() => retryFn?.()}
                  className="underline"
                  style={{ color: 'var(--color-accent)' }}
                >
                  {t.retryLabel}
                </button>
              </p>
            )}

            {messages.length > 0 &&
              !loading &&
              !errorType &&
              !showArgueBar &&
              messages[messages.length - 1].role === 'ai' &&
              !threadClosed && (
                <ReactionButtons
                  onReact={reaction => {
                    setArgueBarPlaceholder(reaction);
                    setShowArgueBar(true);
                  }}
                />
              )}
          </div>
        )}
      </main>

      {showArgueBar && !threadClosed && (
        <ArgueBar
          value={argueMessage}
          onChange={setArgueMessage}
          onSubmit={handleArgueSubmit}
          placeholder={argueBarPlaceholder}
        />
      )}

      {!photoBase64 && <Footer t={t} />}
    </div>
  );
}
