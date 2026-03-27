import { useCallback } from 'react';
import { dispatch } from '@/services/commandService';
import type { CommandVerb } from '@/types/command';

export function useControls() {
  const sendCommand = useCallback((verb: CommandVerb) => {
    dispatch(verb);
  }, []);

  return { sendCommand };
}
