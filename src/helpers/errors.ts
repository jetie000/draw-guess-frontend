import { useAlertStore } from '@/stores/alertStore';
import { AxiosError, isAxiosError } from 'axios';

const getErrorMessage = (error: AxiosError) => {
  if (
    error.response &&
    error.response.data instanceof Object &&
    'message' in error.response.data &&
    Array.isArray(error.response?.data?.message)
  ) {
    return error.response.data.message[0];
  }
  return error.message;
};

export const handleNetworkError = (error: any) => {
  const alertStore = useAlertStore();
  alertStore.showAlert(isAxiosError(error) ? getErrorMessage(error) : 'Something went wrong');
};
