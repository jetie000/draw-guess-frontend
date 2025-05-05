import { drawingApiInstance } from '..';
import type {
  AddDrawingRequest,
  AddWordResponse,
  Drawing,
  DrawingMessagesResponse,
  Word,
  WordType,
  WordWithType
} from './drawing.api.interface';

export const DrawingApi = {
  createDrawing: (addDrawingRequest: AddDrawingRequest) =>
    drawingApiInstance.post<Drawing>('/drawing', addDrawingRequest).then(({ data }) => data),
  getCurrentGameDrawing: (gameId: number) =>
    drawingApiInstance
      .get<Drawing | undefined>(`/drawing/game-current/${gameId}`)
      .then(({ data }) => data),
  getMyDrawings: () =>
    drawingApiInstance.get<Required<Drawing>[]>('/drawing/my').then(({ data }) => data),
  getWordTypes: () =>
    drawingApiInstance.get<WordType[]>('/drawing-word-type').then(({ data }) => data),
  addWordType: (wordType: string) =>
    drawingApiInstance
      .post<WordType>('/drawing-word-type', { type: wordType })
      .then(({ data }) => data),
  deleteWordType: (wordTypeId: number) =>
    drawingApiInstance
      .delete<WordType>(`/drawing-word-type/${wordTypeId}`)
      .then(({ data }) => data),
  updateWordType: (wordTypeId: number, wordType: string) =>
    drawingApiInstance
      .put<WordType>(`/drawing-word-type/${wordTypeId}`, { type: wordType })
      .then(({ data }) => data),
  getWords: () => drawingApiInstance.get<WordWithType[]>('/drawing-word').then(({ data }) => data),
  addWord: (word: string, typeId: number) =>
    drawingApiInstance.post<Word>('/drawing-word', { word, typeId }).then(({ data }) => data),
  deleteWord: (wordId: number) =>
    drawingApiInstance.delete<Word>(`/drawing-word/${wordId}`).then(({ data }) => data),
  updateWord: (wordId: number, word: string, typeId: number) =>
    drawingApiInstance
      .put<Word>(`/drawing-word/${wordId}`, { word, typeId })
      .then(({ data }) => data),
  addDrawingMessage: (drawingId: number, message: string) =>
    drawingApiInstance
      .post<AddWordResponse>('/drawing-message', { drawingId, message })
      .then(({ data }) => data),
  getDrawingMessages: (drawingId: number) =>
    drawingApiInstance
      .get<DrawingMessagesResponse>(`/drawing-message/drawing/${drawingId}`)
      .then(({ data }) => data)
};
