import { describe, it, expect } from 'vitest';
import { CAMERA_REGISTRY, getCameraById, getCamerasForRobot } from './cameras';

describe('cameras constants', () => {
  it('has 8 cameras', () => {
    expect(CAMERA_REGISTRY).toHaveLength(8);
  });

  it('each camera has required fields', () => {
    CAMERA_REGISTRY.forEach((cam) => {
      expect(cam.id).toBeTruthy();
      expect(cam.label).toBeTruthy();
      expect(cam.robotId).toBeTruthy();
      expect(['front', 'back']).toContain(cam.dir);
      expect(cam.resolution).toBeTruthy();
      expect(cam.fps).toBeGreaterThan(0);
      expect(cam.bg).toBeTruthy();
      expect(cam.lineColor).toBeTruthy();
    });
  });

  it('getCameraById returns correct camera', () => {
    const cam = getCameraById('R001-F');
    expect(cam).toBeDefined();
    expect(cam!.label).toBe('R-001 · Front');
  });

  it('getCameraById returns undefined for unknown', () => {
    expect(getCameraById('UNKNOWN')).toBeUndefined();
  });

  it('getCamerasForRobot returns 2 cameras per robot', () => {
    const cams = getCamerasForRobot('R-001');
    expect(cams).toHaveLength(2);
    expect(cams.map((c) => c.dir).sort()).toEqual(['back', 'front']);
  });
});
