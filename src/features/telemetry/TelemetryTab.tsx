import { useStore } from '@/app/store';
import { TelemetryGrid } from './TelemetryGrid';
import { RttSparkline } from './RttSparkline';
import { useRef, useEffect, useState } from 'react';

const EMPTY_RTT: number[] = [];

export function TelemetryTab() {
  const selectedRobotId = useStore((s) => s.selectedRobotId);
  const telemetry = useStore((s) => s.telemetry[selectedRobotId]);
  const rttHistoryRaw = useStore((s) => s.rttHistory[selectedRobotId]);
  const rttHistory = rttHistoryRaw ?? EMPTY_RTT;
  const [heartbeatFlash, setHeartbeatFlash] = useState(false);
  const prevTs = useRef<string | null>(null);

  useEffect(() => {
    if (telemetry && telemetry.ts !== prevTs.current) {
      prevTs.current = telemetry.ts;
      setHeartbeatFlash(true);
      const timer = setTimeout(() => setHeartbeatFlash(false), 200);
      return () => clearTimeout(timer);
    }
  }, [telemetry]);

  if (!telemetry) {
    return (
      <div style={{ padding: '20px', fontSize: '10px', color: 'var(--text-dim)', textAlign: 'center' }}>
        Waiting for telemetry...
      </div>
    );
  }

  const batColor = telemetry.batteryPct < 20 ? 'var(--red)' : telemetry.batteryPct < 40 ? 'var(--amber)' : 'var(--green)';

  return (
    <div>
      {/* Motion & Position */}
      <div style={{ padding: '10px 12px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ fontSize: '9px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>
          Motion & Position
        </div>
        <TelemetryGrid
          items={[
            { key: 'Speed', value: telemetry.speedMs.toFixed(2), unit: 'm/s', gauge: { value: telemetry.speedMs * 100, color: 'var(--cyan)' } },
            { key: 'Heading', value: String(telemetry.headingDeg).padStart(3, '0'), unit: '°' },
            { key: 'X Pos', value: telemetry.xPos.toFixed(1), unit: 'm' },
            { key: 'Y Pos', value: telemetry.yPos.toFixed(1), unit: 'm' },
          ]}
        />
      </div>

      {/* System Health */}
      <div style={{ padding: '10px 12px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ fontSize: '9px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>
          System Health
        </div>
        <TelemetryGrid
          items={[
            { key: 'Battery', value: String(Math.round(telemetry.batteryPct)), unit: '%', gauge: { value: telemetry.batteryPct, color: batColor } },
            { key: 'CPU', value: String(telemetry.cpuPct), unit: '%', gauge: { value: telemetry.cpuPct, color: 'var(--cyan)' } },
            { key: 'Net ↑', value: telemetry.netUpMbs.toFixed(1), unit: 'MB/s' },
            { key: 'Net ↓', value: telemetry.netDownMbs.toFixed(1), unit: 'MB/s' },
          ]}
        />
      </div>

      {/* Network */}
      <div style={{ padding: '10px 12px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ fontSize: '9px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>
          Network
        </div>
        <TelemetryGrid
          items={[
            { key: 'RTT', value: String(telemetry.rttMs), unit: 'ms' },
            { key: 'Pkt Loss', value: telemetry.packetLossPct.toFixed(1), unit: '%' },
          ]}
        />
        <RttSparkline data={rttHistory} />
      </div>

      {/* Heartbeat */}
      <div style={{ padding: '10px 12px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ fontSize: '9px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>
          Heartbeat
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '4px 0' }}>
          <div
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: heartbeatFlash ? 'var(--cyan)' : 'var(--green)',
              boxShadow: heartbeatFlash ? '0 0 8px var(--cyan)' : '0 0 6px var(--green)',
              transition: 'all 0.2s',
            }}
          />
          <div style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>
            Last ping: <span style={{ color: 'var(--green)' }}>0.5s ago</span>
          </div>
          <div style={{ marginLeft: 'auto', fontSize: '10px', color: 'var(--text-secondary)' }}>
            Watchdog: <span style={{ color: 'var(--green)' }}>OK</span>
          </div>
        </div>
      </div>
    </div>
  );
}
