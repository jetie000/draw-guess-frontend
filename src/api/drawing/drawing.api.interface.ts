export interface AddDrawingRequest {
  posX: number[];
  posY: number[];
  color: string;
  lineWidth: number;
  roundNumber: number;
  gameId: number;
  gamePlayerId: number;
  drawingId?: number;
}

interface DrawingPart {
  id: number;
  posX: number[];
  posY: number[];
  color: string;
  lineWidth: number;
  drawingId: number;
}

export interface Drawing {
  id: number;
  gamePlayerId: number;
  gameId: number;
  roundNumber: number;
  drawingParts: DrawingPart[];
}
