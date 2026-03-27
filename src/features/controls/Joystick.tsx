import { useRef, useCallback } from 'react';
import { dispatch } from '@/services/commandService';

export function Joystick() {
  const containerRef = useRef<HTMLDivElement>(null);
  const knobRef = useRef<HTMLDivElement>(null);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect || !knobRef.current) return;

    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const dx = e.clientX - rect.left - cx;
    const dy = e.clientY - rect.top - cy;
    const dist = Math.min(Math.sqrt(dx * dx + dy * dy), cx - 12);
    const angle = Math.atan2(dy, dx);
    const kx = Math.cos(angle) * dist;
    const ky = Math.sin(angle) * dist;

    knobRef.current.style.transform = `translate(calc(-50% + ${kx}px), calc(-50% + ${ky}px))`;

    const absX = Math.abs(dx);
    const absY = Math.abs(dy);
    if (absY > absX) {
      dispatch(dy < 0 ? 'forward' : 'backward');
    } else {
      dispatch(dx < 0 ? 'left' : 'right');
    }
  }, []);

  const handlePointerUp = useCallback(() => {
    if (knobRef.current) {
      knobRef.current.style.transform = 'translate(-50%, -50%)';
    }
  }, []);

  return (
    <div
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      title="Virtual joystick"
      style={{
        width: '64px',
        height: '64px',
        borderRadius: '50%',
        border: '1.5px solid var(--border-bright)',
        background: 'var(--bg-card)',
        position: 'relative',
        cursor: 'pointer',
        flexShrink: 0,
      }}
    >
      {/* Cross hair */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'none',
        }}
      >
        <div
          style={{
            position: 'absolute',
            width: '1px',
            height: '80%',
            background: 'var(--border)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            width: '80%',
            height: '1px',
            background: 'var(--border)',
          }}
        />
      </div>

      {/* Knob */}
      <div
        ref={knobRef}
        style={{
          position: 'absolute',
          width: '22px',
          height: '22px',
          borderRadius: '50%',
          background: 'radial-gradient(circle at 35% 35%, var(--border-bright), var(--bg-void))',
          border: '1.5px solid var(--border-bright)',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          transition: 'transform 0.1s ease',
          pointerEvents: 'none',
        }}
      />
    </div>
  );
}
