export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH';

export interface RiskScore {
  score: number;
  level: RiskLevel;
  factors: {
    proximity: number;
    cmdVelocity: number;
    operatorHistory: number;
    pathDeviation: number;
    cameraQuality: number;
  };
  xaiSummary: string;
  robotId: string;
  ts: string;
}
