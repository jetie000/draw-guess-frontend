import { format } from 'date-fns';

export const formatSeconds = (seconds: number) =>
  `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;

export const formatDate = (date: Date | string) => format(date, 'HH:mm dd.MM.yyyy');
