import { useState, useCallback } from 'react';
import { dispatch } from '@/services/commandService';
import type { CommandVerb } from '@/types/command';

export function DPad() {
  const [pressed, setPressed] = useState<CommandVerb | null>(null);

  const handleDown = useCallback((verb: CommandVerb) => {
    setPressed(verb);
    dispatch(verb);
  }, []);

  const handleUp = useCallback(() => {
    setPressed(null);
  }, []);

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 30px)',
        gridTemplateRows: 'repeat(3, 30px)',
        gap: '2px',
      }}
    >
      <div />
      <DPadBtn verb="forward" label="▲" pressed={pressed === 'forward'} onDown={handleDown} onUp={handleUp} />
      <div />
      <DPadBtn verb="left" label="◀" pressed={pressed === 'left'} onDown={handleDown} onUp={handleUp} />
      <DPadBtn verb="stop" label="STOP" pressed={pressed === 'stop'} onDown={handleDown} onUp={handleUp} isCenter />
      <DPadBtn verb="right" label="▶" pressed={pressed === 'right'} onDown={handleDown} onUp={handleUp} />
      <div />
      <DPadBtn verb="backward" label="▼" pressed={pressed === 'backward'} onDown={handleDown} onUp={handleUp} />
      <div />
    </div>
  );
}

function DPadBtn({
  verb,
  label,
  pressed,
  onDown,
  onUp,
  isCenter,
}: {
  verb: CommandVerb;
  label: string;
  pressed: boolean;
  onDown: (v: CommandVerb) => void;
  onUp: () => void;
  isCenter?: boolean;
}) {
  const isActive = pressed;
  const centerStyle: React.CSSProperties = isCenter
    ? { background: 'var(--red-glow)', borderColor: 'var(--red)', color: 'var(--red)', fontSize: '8px', fontWeight: 700 }
    : {};
  const activeStyle: React.CSSProperties = isActive
    ? { background: isCenter ? 'var(--red-glow)' : 'var(--amber-glow)', borderColor: isCenter ? 'var(--red)' : 'var(--amber)', color: isCenter ? 'var(--red)' : 'var(--amber)' }
    : {};

  return (
    <button
      onMouseDown={() => onDown(verb)}
      onMouseUp={onUp}
      onMouseLeave={onUp}
      data-cmd={verb}
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        color: 'var(--text-secondary)',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '11px',
        borderRadius: '2px',
        transition: 'all 0.1s',
        userSelect: 'none',
        fontFamily: 'inherit',
        padding: 0,
        ...centerStyle,
        ...activeStyle,
      }}
    >
      {label}
    </button>
  );
}
