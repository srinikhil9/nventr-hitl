import { Joystick } from './Joystick';
import { DPad } from './DPad';
import { SpeedSlider } from './SpeedSlider';
import { CommandLog } from './CommandLog';
import { useKeyboardControls } from '@/hooks/useKeyboardControls';

export function ControlStrip() {
  useKeyboardControls();

  return (
    <div
      style={{
        background: 'var(--bg-panel)',
        borderTop: '1px solid var(--border)',
        padding: '10px 14px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        flexShrink: 0,
        minHeight: '84px',
      }}
    >
      <Joystick />
      <DPad />
      <SpeedSlider />
      <GeofenceIndicator />
      <CommandLog />
    </div>
  );
}

function GeofenceIndicator() {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        padding: '8px 10px',
        border: '1px solid var(--border)',
        background: 'var(--bg-card)',
        borderRadius: '10px',
      }}
      title="Active geofence zone"
    >
      <div
        style={{
          width: '7px',
          height: '7px',
          borderRadius: '50%',
          background: 'var(--green)',
          boxShadow: '0 0 6px var(--green)',
        }}
      />
      <div>
        <div style={{ fontSize: '11px', color: 'var(--text-primary)', fontWeight: 600 }}>ZONE-1</div>
        <div style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>Geofence: ACTIVE</div>
      </div>
    </div>
  );
}
