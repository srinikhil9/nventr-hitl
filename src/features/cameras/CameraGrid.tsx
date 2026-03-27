import type { CSSProperties } from 'react';
import { useStore } from '@/app/store';
import { CameraCell } from './CameraCell';
import type { LayoutMode } from '@/types/camera';

const GRID_STYLES: Record<LayoutMode, CSSProperties> = {
  '1': { gridTemplateColumns: '1fr', gridTemplateRows: '1fr' },
  '2h': { gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr' },
  '4': { gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr' },
  main: { gridTemplateColumns: '2fr 1fr', gridTemplateRows: '1fr 1fr' },
};

export function CameraGrid() {
  const activeFeeds = useStore((s) => s.activeFeeds);
  const layoutMode = useStore((s) => s.layoutMode);

  if (activeFeeds.length === 0) {
    return (
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '6px',
          color: 'var(--text-dim)',
          fontSize: '10px',
          border: '1px dashed var(--border)',
        }}
      >
        <div style={{ fontSize: '22px', opacity: 0.4 }}>⊡</div>
        <div>No feeds active — add a camera above</div>
      </div>
    );
  }

  return (
    <div
      style={{
        flex: 1,
        display: 'grid',
        gap: '1px',
        background: 'var(--border)',
        overflow: 'hidden',
        transition: 'grid-template-columns 0.2s ease, grid-template-rows 0.2s ease',
        ...GRID_STYLES[layoutMode],
      }}
    >
      {activeFeeds.map((id, idx) => (
        <CameraCell
          key={id}
          cameraId={id}
          isFirst={idx === 0}
          spanRows={layoutMode === 'main' && idx === 0}
        />
      ))}
    </div>
  );
}
