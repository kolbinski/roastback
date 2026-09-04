export default function LoadingScreen() {
  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ backgroundColor: 'var(--color-bg)' }}
    >
      <div
        className="w-8 h-8 rounded-full animate-spin"
        style={{
          border: '2px solid var(--color-border)',
          borderTopColor: 'var(--color-accent)',
        }}
      />
    </div>
  );
}
