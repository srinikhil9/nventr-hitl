interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'active' | 'idle' | 'stopped' | 'assigned' | 'pending' | 'approved';
}

const variantStyles: Record<string, string> = {
  default: 'background: var(--bg-card); border: 1px solid var(--border); color: var(--text-secondary);',
  active: 'background: var(--green-glow); color: var(--green); border: 1px solid var(--green);',
  idle: 'background: transparent; color: var(--text-secondary); border: 1px solid var(--border);',
  stopped: 'background: var(--red-glow); color: var(--red); border: 1px solid var(--red);',
  assigned: 'background: var(--amber-glow); color: var(--amber); border: 1px solid var(--amber-dim);',
  pending: 'background: var(--amber-glow); color: var(--amber); border: 1px solid var(--amber-dim);',
  approved: 'background: var(--green-glow); color: var(--green); border: 1px solid var(--green);',
};

export function Badge({ children, variant = 'default' }: BadgeProps) {
  return (
    <span
      style={{
        fontSize: '9px',
        padding: '1px 6px',
        borderRadius: '1px',
        textTransform: 'uppercase',
        letterSpacing: '0.06em',
        fontWeight: 600,
        ...parseStyle(variantStyles[variant] ?? variantStyles.default),
      }}
    >
      {children}
    </span>
  );
}

function parseStyle(css: string): React.CSSProperties {
  const obj: Record<string, string> = {};
  css.split(';').forEach((pair) => {
    const [key, val] = pair.split(':').map((s) => s.trim());
    if (key && val) {
      const camel = key.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
      obj[camel] = val;
    }
  });
  return obj as unknown as React.CSSProperties;
}
