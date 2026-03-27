import type { CommandVerb } from '@/types/command';

export const SAFE_PATHS: CommandVerb[] = ['forward', 'backward', 'left', 'right', 'stop'];

export const GEOFENCE_ZONES: Record<string, CommandVerb[]> = {
  'ZONE-1': ['forward', 'backward', 'left', 'right', 'stop'],
  'ZONE-2': ['forward', 'backward', 'stop'],
};
