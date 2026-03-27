import type { CameraDefinition } from '@/types/camera';

export const CAMERA_REGISTRY: CameraDefinition[] = [
  { id: 'R001-F', label: 'R-001 · Front', robotId: 'R-001', dir: 'front', resolution: '4K',    fps: 28, livekitTrackName: 'r001-front', bg: '#06101a', lineColor: '#22d3ee', animDelay: '0s',   animDur: '8s'  },
  { id: 'R001-B', label: 'R-001 · Back',  robotId: 'R-001', dir: 'back',  resolution: '1080p', fps: 24, livekitTrackName: 'r001-back',  bg: '#080e14', lineColor: '#f59e0b', animDelay: '-2s',  animDur: '10s' },
  { id: 'R002-F', label: 'R-002 · Front', robotId: 'R-002', dir: 'front', resolution: '4K',    fps: 28, livekitTrackName: 'r002-front', bg: '#071209', lineColor: '#10b981', animDelay: '-4s',  animDur: '9s'  },
  { id: 'R002-B', label: 'R-002 · Back',  robotId: 'R-002', dir: 'back',  resolution: '720p',  fps: 30, livekitTrackName: 'r002-back',  bg: '#0b0f07', lineColor: '#a3e635', animDelay: '-6s',  animDur: '11s' },
  { id: 'R003-F', label: 'R-003 · Front', robotId: 'R-003', dir: 'front', resolution: '1080p', fps: 24, livekitTrackName: 'r003-front', bg: '#120a06', lineColor: '#fb923c', animDelay: '-1s',  animDur: '13s' },
  { id: 'R003-B', label: 'R-003 · Back',  robotId: 'R-003', dir: 'back',  resolution: '720p',  fps: 20, livekitTrackName: 'r003-back',  bg: '#0e0805', lineColor: '#f97316', animDelay: '-3s',  animDur: '12s' },
  { id: 'R004-F', label: 'R-004 · Front', robotId: 'R-004', dir: 'front', resolution: '4K',    fps: 28, livekitTrackName: 'r004-front', bg: '#0a0612', lineColor: '#a78bfa', animDelay: '-5s',  animDur: '7s'  },
  { id: 'R004-B', label: 'R-004 · Back',  robotId: 'R-004', dir: 'back',  resolution: '1080p', fps: 24, livekitTrackName: 'r004-back',  bg: '#080510', lineColor: '#818cf8', animDelay: '-7s',  animDur: '14s' },
];

export function getCameraById(id: string): CameraDefinition | undefined {
  return CAMERA_REGISTRY.find(c => c.id === id);
}

export function getCamerasForRobot(robotId: string): CameraDefinition[] {
  return CAMERA_REGISTRY.filter(c => c.robotId === robotId);
}
