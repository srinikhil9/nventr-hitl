import type { MouseEvent } from 'react';
import { useStore } from '@/app/store';
import { getCameraById } from '@/constants/cameras';

interface CameraCellProps {
  cameraId: string;
  isFirst: boolean;
  spanRows: boolean;
}

export function CameraCell({ cameraId, isFirst, spanRows }: CameraCellProps) {
  const cam = getCameraById(cameraId);
  const selectedFeedId = useStore((s) => s.selectedFeedId);
  const selectFeed = useStore((s) => s.selectFeed);
  const removeFeed = useStore((s) => s.removeFeed);
  const addToast = useStore((s) => s.addToast);
  const activeFeeds = useStore((s) => s.activeFeeds);
  const robots = useStore((s) => s.robots);
  const selectedRobotId = useStore((s) => s.selectedRobotId);
  const riskScore = useStore((s) => s.riskScores[selectedRobotId]);

  if (!cam) return null;

  const isSelected = cameraId === selectedFeedId;
  const robot = robots.find((r) => r.id === cam.robotId);
  const isActive = robot?.status === 'active';
  const showAnomaly = isFirst && riskScore && riskScore.score > 0.7;

  const handleRemove = (e: MouseEvent) => {
    e.stopPropagation();
    if (activeFeeds.length <= 1) {
      addToast('Keep at least one feed active', 'warn');
      return;
    }
    removeFeed(cameraId);
    addToast(`Feed removed: ${cam.label}`, 'info');
  };

  return (
    <div
      className="cam-cell-wrap"
      onClick={() => selectFeed(cameraId)}
      style={{
        background: 'var(--bg-void)',
        position: 'relative',
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'all 0.2s',
        minHeight: 0,
        gridRow: spanRows ? 'span 2' : undefined,
      }}
    >
      {/* Simulated feed */}
      <div
        style={{
          width: '100%',
          height: '100%',
          background: cam.bg,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* SVG perspective grid */}
        <svg
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.06 }}
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <line x1="50" y1="42" x2="0" y2="100" stroke={cam.lineColor} strokeWidth="0.3" />
          <line x1="50" y1="42" x2="100" y2="100" stroke={cam.lineColor} strokeWidth="0.3" />
          <line x1="50" y1="42" x2="50" y2="100" stroke={cam.lineColor} strokeWidth="0.15" />
          <line x1="0" y1="68" x2="100" y2="68" stroke={cam.lineColor} strokeWidth="0.08" />
          <line x1="0" y1="82" x2="100" y2="82" stroke={cam.lineColor} strokeWidth="0.08" />
        </svg>

        {/* Robot silhouette */}
        {isActive && (
          <div
            style={{
              position: 'absolute',
              bottom: '20%',
              width: '40px',
              height: '50px',
              background: 'rgba(245,158,11,0.15)',
              border: '1px solid rgba(245,158,11,0.3)',
              borderRadius: '2px',
              animation: `robot-move ${cam.animDur} ease-in-out infinite`,
              animationDelay: cam.animDelay,
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: '-8px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '20px',
                height: '8px',
                background: 'rgba(245,158,11,0.3)',
                borderRadius: '1px',
              }}
            />
            <div
              style={{
                position: 'absolute',
                top: '4px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '16px',
                height: '2px',
                background: 'rgba(245,158,11,0.5)',
                borderRadius: '1px',
              }}
            />
          </div>
        )}

        {/* Anomaly bounding box */}
        {showAnomaly && (
          <div
            style={{
              position: 'absolute',
              top: '38%',
              left: '60%',
              width: '12%',
              height: '18%',
              border: '1.5px solid var(--amber)',
              boxShadow: '0 0 8px rgba(245,158,11,0.3)',
              pointerEvents: 'none',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: '-18px',
                left: 0,
                background: 'var(--amber)',
                color: '#000',
                fontSize: '8px',
                fontWeight: 700,
                padding: '1px 5px',
                letterSpacing: '0.05em',
              }}
            >
              PERSON 0.87
            </div>
          </div>
        )}

        {/* Scanline overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'repeating-linear-gradient(0deg, rgba(0,0,0,0) 0px, rgba(0,0,0,0) 2px, rgba(0,0,0,0.04) 2px, rgba(0,0,0,0.04) 4px)',
            pointerEvents: 'none',
          }}
        />

        {/* Selection overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: isSelected ? 'rgba(34,211,238,0.04)' : 'transparent',
            border: isSelected ? '1px solid var(--cyan)' : '1px solid rgba(34,211,238,0.15)',
            opacity: isSelected ? 1 : 0,
            transition: 'opacity 0.2s',
            pointerEvents: 'none',
          }}
        />
      </div>

      {/* Camera label */}
      <div
        style={{
          position: 'absolute',
          top: '6px',
          left: '6px',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          pointerEvents: 'none',
        }}
      >
        <div
          style={{
            background: 'rgba(0,0,0,0.72)',
            border: '1px solid rgba(255,255,255,0.1)',
            fontSize: '9px',
            padding: '2px 6px',
            color: 'var(--text-secondary)',
            letterSpacing: '0.04em',
            backdropFilter: 'blur(4px)',
          }}
        >
          {cam.id} · {cam.label.split(' · ')[0]} {cam.dir.toUpperCase()} · {cam.resolution}
        </div>
        {isActive && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '3px',
              background: 'rgba(0,0,0,0.72)',
              border: '1px solid rgba(239,68,68,0.3)',
              fontSize: '9px',
              padding: '2px 5px',
              color: 'var(--red)',
              backdropFilter: 'blur(4px)',
            }}
          >
            <div
              style={{
                width: '5px',
                height: '5px',
                borderRadius: '50%',
                background: 'var(--red)',
                animation: 'blink 1s ease-in-out infinite',
              }}
            />
            REC
          </div>
        )}
      </div>

      {/* Metrics */}
      <div
        style={{
          position: 'absolute',
          bottom: '6px',
          right: '6px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          gap: '2px',
          pointerEvents: 'none',
        }}
      >
        <div
          style={{
            background: 'rgba(0,0,0,0.72)',
            fontSize: '9px',
            padding: '2px 5px',
            color: 'var(--cyan)',
            backdropFilter: 'blur(4px)',
            letterSpacing: '0.03em',
          }}
        >
          {cam.fps}fps · {cam.resolution}
        </div>
      </div>

      {/* Remove button */}
      <button
        onClick={handleRemove}
        title="Remove feed"
        className="cam-remove-hover"
        style={{
          position: 'absolute',
          top: '6px',
          right: '6px',
          background: 'rgba(0,0,0,0.72)',
          border: '1px solid rgba(239,68,68,0.4)',
          color: 'var(--red)',
          fontSize: '10px',
          width: '20px',
          height: '20px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: 0,
          transition: 'opacity 0.15s',
          backdropFilter: 'blur(4px)',
          zIndex: 10,
          fontFamily: 'inherit',
        }}
      >
        ✕
      </button>
    </div>
  );
}
