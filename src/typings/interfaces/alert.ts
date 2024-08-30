import type { AlertTypes } from '../enums/alert';

export interface AlertStore {
  message: string;
  isAlertOpen: boolean;
  type: AlertTypes;
  timeOut: NodeJS.Timeout | null;
}
