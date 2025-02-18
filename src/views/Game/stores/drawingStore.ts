import { defineStore } from 'pinia';

interface DrawingStore {
  color: string;
  strokeWidth: number;
}

export const useDrawingStore = defineStore('drawing', {
  state: (): DrawingStore => ({
    color: '#000000',
    strokeWidth: 2
  })
});
