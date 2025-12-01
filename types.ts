export interface ThumbnailVariant {
  label: string;
  resolution: string;
  url: string;
  key: string;
  isBest?: boolean;
}

export interface VideoData {
  id: string;
  originalUrl: string;
  thumbnails: ThumbnailVariant[];
  timestamp: number;
}

export interface AIAnalysisResult {
  score: number;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  summary: string;
}

export enum AppState {
  IDLE = 'IDLE',
  ANALYZING = 'ANALYZING',
  READY = 'READY',
  ERROR = 'ERROR'
}
