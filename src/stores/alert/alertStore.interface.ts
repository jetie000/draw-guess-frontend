import type { AlertTypes } from '../../typings/enums/alert';

export interface AlertStore {
  message: string;
  isAlertOpen: boolean;
  type: AlertTypes;
  timeOut: NodeJS.Timeout | null;
}
