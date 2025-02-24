import { AlertTypes } from '@/typings/enums/alert';

export const getAlertColorClass = (type: AlertTypes) => {
  switch (type) {
    case AlertTypes.Info:
      return 'text-blue-500';
    case AlertTypes.Success:
      return 'text-green-500';
    case AlertTypes.Warning:
      return 'text-orange-500';
    case AlertTypes.Error:
      return 'text-red-500';
    default:
      return 'text-blue-500';
  }
};
