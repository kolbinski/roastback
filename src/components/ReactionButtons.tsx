export default function ReactionButtons({
  onReact,
}: {
  onReact: (reaction: string) => void;
}) {
  return (
    <div className="flex gap-3 items-center px-4">
      <button
        onClick={() => onReact('Go Harder! 🔥')}
        className="text-sm px-4 py-2 rounded-full transition-colors cursor-pointer"
        style={{
          backgroundColor: 'var(--color-surface)',
          color: 'var(--color-text)',
          border: '1px solid var(--color-border)',
        }}
      >
        Go Harder! 🔥
      </button>
      <button
        onClick={() => onReact('Bullshit! 💩')}
        className="text-sm px-4 py-2 rounded-full transition-colors cursor-pointer"
        style={{
          backgroundColor: 'var(--color-surface)',
          color: 'var(--color-text)',
          border: '1px solid var(--color-border)',
        }}
      >
        Bullshit! 💩
      </button>
    </div>
  );
}
