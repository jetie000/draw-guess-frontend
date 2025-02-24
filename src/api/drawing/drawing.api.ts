import { drawingApiInstance } from '..';
import type { AddDrawingRequest, Drawing } from './drawing.api.interface';

export const DrawingApi = {
  createDrawing: (addDrawingRequest: AddDrawingRequest) =>
    drawingApiInstance.post<Drawing>('/', addDrawingRequest).then(({ data }) => data),
  getCurrentGameDrawing: (gameId: number) =>
    drawingApiInstance.get<Drawing | undefined>(`/game-current/${gameId}`).then(({ data }) => data)
};
