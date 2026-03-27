import { GaugeBar } from '@/components/ui/GaugeBar';

interface TelemetryItem {
  key: string;
  value: string;
  unit: string;
  gauge?: { value: number; color: string };
}

interface TelemetryGridProps {
  items: TelemetryItem[];
}

export function TelemetryGrid({ items }: TelemetryGridProps) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
      {items.map((item) => (
        <div
          key={item.key}
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            padding: '7px 8px',
            borderRadius: '2px',
          }}
        >
          <div style={{ fontSize: '9px', color: 'var(--text-secondary)', marginBottom: '3px' }}>
            {item.key}
          </div>
          <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1 }}>
            {item.value}
            <span style={{ fontSize: '9px', color: 'var(--text-secondary)', fontWeight: 400, marginLeft: '2px' }}>
              {item.unit}
            </span>
          </div>
          {item.gauge && <GaugeBar value={item.gauge.value} color={item.gauge.color} />}
        </div>
      ))}
    </div>
  );
}
