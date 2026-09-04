'use client';

import { useEffect, useState } from 'react';
import { detectLanguage, translations, SUPPORTED_LANGUAGES, type LanguageCode } from '@/lib/i18n';
import { processImage } from '@/lib/image';
import { getVisitorId } from '@/lib/session';
import { callRoast, callArgue } from '@/lib/api';
import type { Message } from '@/lib/types';

export type ErrorType = 'moderation' | 'closed' | 'generic';

export function useRoastback() {
  const [language, setLanguage] = useState<LanguageCode>('en');
  const [ready, setReady] = useState(false);
  const [photoBase64, setPhotoBase64] = useState<string | null>(null);
  const [threadId, setThreadId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [errorType, setErrorType] = useState<ErrorType | null>(null);
  const [retryFn, setRetryFn] = useState<(() => void) | null>(null);
  const [showArgueBar, setShowArgueBar] = useState(false);
  const [argueMessage, setArgueMessage] = useState('');
  const [argueBarPlaceholder, setArgueBarPlaceholder] = useState('...');
  const [threadClosed, setThreadClosed] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('roastback_language');
    const isValid = saved && SUPPORTED_LANGUAGES.some((l) => l.code === saved);
    setLanguage(isValid ? (saved as LanguageCode) : detectLanguage());
    setReady(true);
  }, []);

  const t = translations[language];

  const updateLanguage = (lang: LanguageCode) => {
    localStorage.setItem('roastback_language', lang);
    setLanguage(lang);
  };

  const classifyError = (apiError: string | undefined): ErrorType => {
    if (apiError === 'moderation_flagged') return 'moderation';
    if (apiError === 'closed') return 'closed';
    return 'generic';
  };

  const performRoast = async (base64: string, tid: string) => {
    setErrorType(null);
    setRetryFn(null);
    setLoading(true);

    const { ok, data } = await callRoast({
      image: base64,
      language,
      visitor_id: getVisitorId(),
      thread_id: tid,
    });

    setLoading(false);

    if (ok) {
      setMessages([{ role: 'ai', text: data.roast }]);
    } else {
      const type = classifyError(data.error);
      setErrorType(type);
      if (type === 'generic') {
        setRetryFn(() => () => performRoast(base64, tid));
      }
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const base64 = await processImage(file);
    const newThreadId = crypto.randomUUID();

    setPhotoBase64(base64);
    setThreadId(newThreadId);
    setMessages([]);
    setShowArgueBar(false);
    setThreadClosed(false);
    setArgueBarPlaceholder('...');

    await performRoast(base64, newThreadId);
  };

  const performArgue = async (image: string, tid: string, userText: string) => {
    setErrorType(null);
    setRetryFn(null);
    setLoading(true);

    const { ok, data } = await callArgue({
      image,
      language,
      visitor_id: getVisitorId(),
      thread_id: tid,
      user_message: userText,
    });

    setLoading(false);

    if (ok) {
      setMessages((prev) => [...prev, { role: 'ai', text: data.reply }]);
      if (data.turns_left <= 0) {
        setThreadClosed(true);
        setShowArgueBar(false);
      }
    } else {
      const type = classifyError(data.error);
      setErrorType(type);
      if (type === 'generic') {
        setRetryFn(() => () => performArgue(image, tid, userText));
      }
    }
  };

  const handleArgueSubmit = async () => {
    if (!argueMessage.trim() || !photoBase64 || !threadId) return;

    const userText = argueMessage;
    setMessages((prev) => [...prev, { role: 'user', text: userText }]);
    setArgueMessage('');

    await performArgue(photoBase64, threadId, userText);
  };

  const resetSession = () => {
    setPhotoBase64(null);
    setThreadId(null);
    setMessages([]);
    setErrorType(null);
    setRetryFn(null);
    setShowArgueBar(false);
    setArgueMessage('');
    setArgueBarPlaceholder('...');
    setThreadClosed(false);
  };

  return {
    language,
    setLanguage: updateLanguage,
    ready,
    t,
    photoBase64,
    loading,
    messages,
    errorType,
    retryFn,
    showArgueBar,
    argueBarPlaceholder,
    setShowArgueBar,
    argueMessage,
    setArgueMessage,
    setArgueBarPlaceholder,
    threadClosed,
    handleFileChange,
    handleArgueSubmit,
    resetSession,
  };
}