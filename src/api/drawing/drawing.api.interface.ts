export interface AddDrawingRequest {
  posX: number[];
  posY: number[];
  color: string;
  lineWidth: number;
  gameId: number;
  drawingId: number;
}

export interface DrawingPart {
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
  word?: Word;
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

export interface DrawingMessage {
  id: number;
  gamePlayerId: number;
  drawingId: number;
  sendDate: Date;
  message: string;
}

export interface DrawingMessagesResponse {
  isGuessed: boolean;
  guessedLetters: null | (string | null)[];
  messages: DrawingMessage[];
}

export interface AddWordResponse {
  isGuessed: boolean;
  guessedLetters: null | (string | null)[];
  updatedPoints: number | null;
  message: DrawingMessage;
}

export interface WordWithType extends Omit<Word, 'typeId'> {
  type: WordType;
}
