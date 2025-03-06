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

export interface WordType {
  id: number;
  type: string;
}

export interface Word {
  id: number;
  word: string;
  typeId: number;
}

export interface WordWithType extends Omit<Word, 'typeId'> {
  type: WordType;
}
