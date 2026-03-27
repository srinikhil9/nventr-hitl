import type { MouseEvent } from 'react';
import { useState } from 'react';
import { useStore } from '@/app/store';
import { CAMERA_REGISTRY, getCameraById } from '@/constants/cameras';
import type { LayoutMode } from '@/types/camera';

const LAYOUTS: LayoutMode[] = ['main', '2h', '4', '1'];
const LAYOUT_LABELS: Record<LayoutMode, string> = {
  main: 'Main+Side',
  '2h': 'Side-by-Side',
  '4': '2×2 Grid',
  '1': 'Single',
};

export function CameraToolbar() {
  const activeFeeds = useStore((s) => s.activeFeeds);
  const selectedFeedId = useStore((s) => s.selectedFeedId);
  const layoutMode = useStore((s) => s.layoutMode);
  const addFeed = useStore((s) => s.addFeed);
  const removeFeed = useStore((s) => s.removeFeed);
  const selectFeed = useStore((s) => s.selectFeed);
  const setLayout = useStore((s) => s.setLayout);
  const addToast = useStore((s) => s.addToast);

  const [addSelectValue, setAddSelectValue] = useState('');

  const available = CAMERA_REGISTRY.filter((c) => !activeFeeds.includes(c.id));

  const handleAdd = () => {
    const id = addSelectValue || available[0]?.id;
    if (!id || activeFeeds.includes(id)) return;
    if (activeFeeds.length >= 4) {
      addToast('Max 4 feeds at once', 'warn');
      return;
    }
    addFeed(id);
    const cam = getCameraById(id);
    addToast(`Feed added: ${cam?.label ?? id}`, 'success');
    setAddSelectValue('');
  };

  const handleRemove = (id: string, e: MouseEvent) => {
    e.stopPropagation();
    if (activeFeeds.length <= 1) {
      addToast('Keep at least one feed active', 'warn');
      return;
    }
    removeFeed(id);
    const cam = getCameraById(id);
    addToast(`Feed removed: ${cam?.label ?? id}`, 'info');
  };

  const cycleLayout = () => {
    const idx = LAYOUTS.indexOf(layoutMode);
    const next = LAYOUTS[(idx + 1) % LAYOUTS.length];
    setLayout(next);
  };

  return (
    <div
      style={{
        background: 'var(--bg-panel)',
        borderBottom: '1px solid var(--border)',
        height: '36px',
        display: 'flex',
        alignItems: 'center',
        padding: '0 10px',
        gap: '10px',
        flexShrink: 0,
      }}
    >
      {/* Left */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: 0, overflow: 'hidden' }}>
        <span
          style={{
            fontSize: '9px',
            color: 'var(--text-secondary)',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            flexShrink: 0,
          }}
        >
          FEEDS
        </span>
        <div style={{ display: 'flex', gap: '4px', overflowX: 'auto', flex: 1 }}>
          {activeFeeds.map((id) => {
            const cam = getCameraById(id);
            if (!cam) return null;
            const isSelected = id === selectedFeedId;
            return (
              <div
                key={id}
                onClick={() => selectFeed(id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  background: 'var(--bg-card)',
                  border: `1px solid ${isSelected ? 'var(--cyan)' : 'var(--border)'}`,
                  borderLeft: `2px solid ${cam.dir === 'front' ? 'var(--amber)' : 'var(--cyan)'}`,
                  padding: '2px 7px 2px 8px',
                  borderRadius: '2px',
                  fontSize: '9px',
                  color: isSelected ? 'var(--cyan)' : 'var(--text-secondary)',
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                  cursor: 'pointer',
                  transition: 'border-color 0.12s',
                }}
              >
                {cam.label}
                <button
                  onClick={(e) => handleRemove(id, e)}
                  title="Remove"
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-dim)',
                    cursor: 'pointer',
                    fontSize: '10px',
                    lineHeight: 1,
                    padding: '0 1px',
                    transition: 'color 0.1s',
                    fontFamily: 'inherit',
                  }}
                >
                  ✕
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
        <select
          value={addSelectValue}
          onChange={(e) => setAddSelectValue(e.target.value)}
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            color: 'var(--text-secondary)',
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '9px',
            padding: '3px 6px',
            outline: 'none',
            cursor: 'pointer',
            maxWidth: '160px',
          }}
        >
          {available.length === 0 ? (
            <option>All feeds active</option>
          ) : (
            available.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label} ({c.resolution})
              </option>
            ))
          )}
        </select>
        <button
          onClick={handleAdd}
          disabled={available.length === 0}
          style={{
            background: 'var(--amber-glow)',
            border: '1px solid var(--amber-dim)',
            color: 'var(--amber)',
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '9px',
            fontWeight: 600,
            padding: '3px 9px',
            cursor: available.length === 0 ? 'not-allowed' : 'pointer',
            letterSpacing: '0.05em',
            transition: 'all 0.12s',
            opacity: available.length === 0 ? 0.5 : 1,
          }}
        >
          + ADD
        </button>
        <button
          onClick={cycleLayout}
          title="Change layout"
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            color: 'var(--text-secondary)',
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '9px',
            padding: '3px 8px',
            cursor: 'pointer',
            transition: 'all 0.12s',
            whiteSpace: 'nowrap',
          }}
        >
          ⊞ {LAYOUT_LABELS[layoutMode]}
        </button>
      </div>
    </div>
  );
}
