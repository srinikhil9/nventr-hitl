interface XaiSummaryProps {
  summary: string;
}

export function XaiSummary({ summary }: XaiSummaryProps) {
  return (
    <div
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        padding: '10px',
        borderRadius: '2px',
      }}
    >
      <div style={{ fontSize: '10px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
        {summary}
      </div>
    </div>
  );
}
