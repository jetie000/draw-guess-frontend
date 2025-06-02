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
  price: number;
}

export type WordTypeRequest = Omit<WordType, 'id'>;

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
  isGuessed: boolean;
  isFirst: boolean;
  secondsPassedAfterRound: number;
  isLetterBought: boolean;
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

export interface OperLetterResponse extends AddWordResponse {
  updatedMoney: number;
}

export interface WordWithType extends Omit<Word, 'typeId'> {
  type: WordType;
}
