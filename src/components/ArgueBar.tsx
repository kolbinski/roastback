'use client';

import { useRef } from 'react';
import { PaperPlaneRight } from '@phosphor-icons/react';

export default function ArgueBar({
  value,
  onChange,
  onSubmit,
  placeholder = '...',
}: {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  placeholder?: string;
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleInput = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 200) + 'px';
  };

  return (
    <div
      className="fixed bottom-0 left-0 right-0 backdrop-blur"
      style={{
        backgroundColor: 'color-mix(in srgb, var(--color-bg) 95%, transparent)',
        borderTop: '1px solid var(--color-border)',
      }}
    >
      <div className="max-w-2xl mx-auto flex items-end gap-3 py-4 px-4">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={e => {
            onChange(e.target.value);
            handleInput();
          }}
          onKeyDown={e => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              onSubmit();
              if (textareaRef.current)
                textareaRef.current.style.height = 'auto';
            }
          }}
          rows={1}
          placeholder={placeholder}
          className="flex-1 rounded-2xl px-4 py-3 resize-none outline-none transition-colors max-h-[200px]"
          style={{
            backgroundColor: 'var(--color-surface)',
            color: 'var(--color-text)',
            border: '1px solid var(--color-border)',
          }}
        />
        <button
          onClick={() => {
            onSubmit();
            if (textareaRef.current) textareaRef.current.style.height = 'auto';
          }}
          className="rounded-full p-3 hover:opacity-90 transition-opacity flex-shrink-0 cursor-pointer"
          style={{
            backgroundColor: 'var(--color-accent)',
            color: 'var(--color-accent-text)',
          }}
        >
          <PaperPlaneRight size={20} weight="fill" />
        </button>
      </div>
    </div>
  );
}
