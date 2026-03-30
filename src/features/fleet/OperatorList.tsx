export function OperatorList() {
  return (
    <div style={{ borderTop: '1px solid var(--border)' }}>
      <div
        style={{
          padding: '12px 14px',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div
          style={{
            fontSize: '13px',
            fontWeight: 600,
            color: 'var(--text-secondary)',
          }}
        >
          Operators
        </div>
        <div
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            fontSize: '11px',
            padding: '2px 8px',
            color: 'var(--text-secondary)',
            borderRadius: '999px',
          }}
        >
          2 active
        </div>
      </div>

      <OperatorItem initials="AK" name="Alice Kumar" detail="R-001 · Zone-1 · 42min" gradient="linear-gradient(135deg, #1e40af, var(--cyan-dim))" />
      <OperatorItem initials="BR" name="Bob Reyes" detail="R-002 · Zone-2 · 18min" gradient="linear-gradient(135deg, #064e3b, #10b981)" />
    </div>
  );
}

function OperatorItem({
  initials,
  name,
  detail,
  gradient,
}: {
  initials: string;
  name: string;
  detail: string;
  gradient: string;
}) {
  return (
    <div
      style={{
        padding: '10px 14px',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        cursor: 'pointer',
        transition: 'background 0.12s',
      }}
    >
      <div
        style={{
          width: '24px',
          height: '24px',
          borderRadius: '50%',
          background: gradient,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '10px',
          fontWeight: 700,
          color: 'white',
          flexShrink: 0,
        }}
      >
        {initials}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-primary)' }}>{name}</div>
        <div
          style={{
            fontSize: '10px',
            color: 'var(--text-secondary)',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {detail}
        </div>
      </div>
      <div
        style={{
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          background: 'var(--green)',
          boxShadow: '0 0 6px var(--green)',
        }}
      />
    </div>
  );
}
