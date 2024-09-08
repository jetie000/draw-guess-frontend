import { useAlertStore } from '@/stores/alert/alertStore';
import { AlertTypes } from '@/typings/enums/alert';
import { AxiosError, isAxiosError } from 'axios';

const BadRequestErrorStatus = 400;

const getErrorMessage = (error: AxiosError) => {
  if (error.response && error.response.data instanceof Object && 'message' in error.response.data) {
    const message = Array.isArray(error.response?.data?.message)
      ? error.response.data.message[0]
      : error.response.data.message;
    return message.charAt(0).toUpperCase() + message.slice(1);
  }
  return error.message;
};

const getErrorType = (error: AxiosError) => {
  if (
    error.response &&
    error.response.data instanceof Object &&
    'statusCode' in error.response.data
  ) {
    if (error.response.data.statusCode === BadRequestErrorStatus) {
      return AlertTypes.Warning;
    }
  }
  return AlertTypes.Error;
};

export const handleNetworkError = (error: any) => {
  const alertStore = useAlertStore();
  alertStore.showAlert(
    isAxiosError(error) ? getErrorMessage(error) : 'Something went wrong',
    getErrorType(error)
  );
};
