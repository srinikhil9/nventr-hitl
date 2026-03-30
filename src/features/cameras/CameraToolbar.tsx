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
        minHeight: '44px',
        display: 'flex',
        alignItems: 'center',
        padding: '6px 10px',
        gap: '10px',
        flexShrink: 0,
      }}
    >
      {/* Left */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: 0, overflow: 'hidden' }}>
        <span
          style={{
            fontSize: '11px',
            color: 'var(--text-secondary)',
            flexShrink: 0,
            fontWeight: 600,
          }}
        >
          Feeds
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
                  border: `1px solid ${isSelected ? 'var(--brand-border)' : 'var(--border)'}`,
                  borderLeft: `3px solid ${cam.dir === 'front' ? 'var(--brand)' : 'var(--cyan)'}`,
                  padding: '4px 8px',
                  borderRadius: '8px',
                  fontSize: '11px',
                  color: isSelected ? 'var(--brand)' : 'var(--text-secondary)',
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
            fontSize: '11px',
            padding: '6px 8px',
            outline: 'none',
            cursor: 'pointer',
            maxWidth: '160px',
            borderRadius: '8px',
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
            background: 'var(--brand-soft)',
            border: '1px solid var(--brand-border)',
            color: 'var(--brand)',
            fontSize: '11px',
            fontWeight: 600,
            padding: '6px 10px',
            cursor: available.length === 0 ? 'not-allowed' : 'pointer',
            transition: 'all 0.12s',
            opacity: available.length === 0 ? 0.5 : 1,
            borderRadius: '8px',
          }}
        >
          + Add
        </button>
        <button
          onClick={cycleLayout}
          title="Change layout"
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            color: 'var(--text-secondary)',
            fontSize: '11px',
            padding: '6px 10px',
            cursor: 'pointer',
            transition: 'all 0.12s',
            whiteSpace: 'nowrap',
            borderRadius: '8px',
          }}
        >
          Layout: {LAYOUT_LABELS[layoutMode]}
        </button>
      </div>
    </div>
  );
}
