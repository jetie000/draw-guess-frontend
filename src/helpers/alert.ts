import { AlertTypes } from '@/typings/enums/alert';
import successIcon from '@/assets/alert/success.svg';
import errorIcon from '@/assets/alert/error.svg';
import warningIcon from '@/assets/alert/warning.svg';
import infoIcon from '@/assets/alert/info.svg';

export const getAlertIcon = (type: AlertTypes) => {
  switch (type) {
    case AlertTypes.Info:
      return infoIcon;
    case AlertTypes.Success:
      return successIcon;
    case AlertTypes.Warning:
      return warningIcon;
    case AlertTypes.Error:
      return errorIcon;
    default:
      return infoIcon;
  }
};

export const getAlertColorClass = (type: AlertTypes) => {
  switch (type) {
    case AlertTypes.Info:
      return 'bg-blue-500';
    case AlertTypes.Success:
      return 'bg-green-500';
    case AlertTypes.Warning:
      return 'bg-orange-500';
    case AlertTypes.Error:
      return 'bg-red-500';
    default:
      return 'bg-blue-500';
  }
};
