import type { loadImage, Image, ImageData, Canvas, CanvasRenderingContext2D } from 'canvas'

export interface Font {
  family: string;
  path: string;
  style?: string;
  weight?: string;
}

export interface MotionBlurConfig {
  samplesPerFrame?: number;
  shutterAngle?: number;
}

interface SketchContext {
  width: number;
  height: number;
  duration: number;
  totalFrames: number;
  fps: number;
  loadImage: typeof loadImage;
  Image: typeof Image;
  ImageData: typeof ImageData;
}

interface RenderContext extends SketchContext {
  canvas: Canvas;
  context: CanvasRenderingContext2D;
  time: number;
  frame: number;
  playhead: number;
  deltaTime: number;
}

type SyncOrAsync<T> = T | Promise<T>;
type SketchReturn = RenderFunction | { render: RenderFunction }
export type SketchFunction = (context: SketchContext) => SyncOrAsync<SketchReturn>;
export type RenderFunction = (context: RenderContext) => SyncOrAsync<void>;
