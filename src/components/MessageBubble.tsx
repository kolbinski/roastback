import type { Message } from '@/lib/types';

export default function MessageBubble({ message }: { message: Message }) {
  if (message.role === 'ai') {
    return <p className="whitespace-pre-wrap w-full">{message.text}</p>;
  }

  return (
    <div className="flex justify-end">
      <div
        className="rounded-2xl rounded-br-sm px-4 py-3 text-sm max-w-[80%]"
        style={{
          backgroundColor: 'var(--color-user-bubble)',
          color: 'var(--color-accent-text)',
          lineHeight: '1.2',
        }}
      >
        {message.text}
      </div>
    </div>
  );
}
