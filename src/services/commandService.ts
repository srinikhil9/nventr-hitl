import { useStore } from '@/app/store';
import { wsManager } from './wsManager';
import { SAFE_PATHS } from '@/constants/routes';
import { DEMO_MODE } from '@/constants/config';
import type { Command, CommandVerb, CommandStatus } from '@/types/command';
import { v4 as uuid } from 'uuid';

export async function dispatch(verb: CommandVerb): Promise<CommandStatus> {
  const store = useStore.getState();

  if (store.estopActive) {
    const cmd = buildCommand(verb, store, 'estop');
    store.appendCommand(cmd);
    return 'estop';
  }

  if (!SAFE_PATHS.includes(verb)) {
    const cmd = buildCommand(verb, store, 'blocked');
    store.appendCommand(cmd);
    return 'blocked';
  }

  const selectedRisk = store.riskScores[store.selectedRobotId];
  if (selectedRisk && selectedRisk.score > 0.75) {
    const cmd = buildCommand(verb, store, 'blocked');
    store.appendCommand(cmd);
    return 'blocked';
  }

  const cmd = buildCommand(verb, store, 'sent');
  store.appendCommand(cmd);

  if (!DEMO_MODE) {
    wsManager.send({ type: 'command', payload: cmd });
  }

  // Simulate ACK in demo mode
  if (DEMO_MODE) {
    setTimeout(() => {
      useStore.getState().updateCommandStatus(cmd.id, 'ack');
    }, 80 + Math.random() * 120);
  }

  return 'sent';
}

function buildCommand(
  verb: CommandVerb,
  store: ReturnType<typeof useStore.getState>,
  status: CommandStatus,
): Command {
  return {
    id: uuid(),
    timestamp: new Date().toISOString(),
    verb,
    robotId: store.selectedRobotId,
    operatorId: store.session?.operatorId ?? 'unknown',
    riskAtSend: store.riskScores[store.selectedRobotId]?.score ?? 0,
    speedMs: store.speed / 100,
    status,
    geofenceValid: true,
  };
}
