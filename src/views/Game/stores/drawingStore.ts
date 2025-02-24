import { defineStore } from 'pinia';
import { colors, strokeWidths } from '@/helpers/constants';

interface DrawingStore {
  color: string;
  strokeWidth: number;
}

export const useDrawingStore = defineStore('drawing', {
  state: (): DrawingStore => ({
    color: colors[0],
    strokeWidth: strokeWidths[1]
  })
});
