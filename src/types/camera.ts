export type CameraDir = 'front' | 'back';

export interface CameraDefinition {
  id: string;
  label: string;
  robotId: string;
  dir: CameraDir;
  resolution: string;
  fps: number;
  livekitTrackName: string;
  bg: string;
  lineColor: string;
  animDelay: string;
  animDur: string;
}

export type LayoutMode = 'main' | '2h' | '4' | '1';
