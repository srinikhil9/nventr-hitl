import { useEffect, useRef } from 'react';
import { dispatch } from '@/services/commandService';
import type { CommandVerb } from '@/types/command';

const KEY_MAP: Record<string, CommandVerb> = {
  ArrowUp: 'forward',
  ArrowDown: 'backward',
  ArrowLeft: 'left',
  ArrowRight: 'right',
  ' ': 'stop',
};

export function useKeyboardControls(onPress?: (verb: CommandVerb) => void, onRelease?: () => void) {
  const activeKey = useRef<string | null>(null);
  const repeatTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const tag = (document.activeElement?.tagName ?? '').toLowerCase();
      if (tag === 'input' || tag === 'textarea' || tag === 'select') return;

      const verb = KEY_MAP[e.key];
      if (!verb) return;
      e.preventDefault();

      if (activeKey.current === e.key) return;
      activeKey.current = e.key;

      dispatch(verb);
      onPress?.(verb);

      if (repeatTimer.current) clearInterval(repeatTimer.current);
      repeatTimer.current = setInterval(() => {
        dispatch(verb);
      }, 100);
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (activeKey.current === e.key) {
        activeKey.current = null;
        if (repeatTimer.current) {
          clearInterval(repeatTimer.current);
          repeatTimer.current = null;
        }
        onRelease?.();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      if (repeatTimer.current) clearInterval(repeatTimer.current);
    };
  }, [onPress, onRelease]);
}
