import { UserApi } from '@/api/user/user.api';
import { handleNetworkError } from '@/helpers/errors';
import { useAlertStore } from '@/stores/alert/alertStore';
import { AlertTypes } from '@/typings/enums/alert';
import { ref } from 'vue';

export const useSignUp = () => {
  const isLoading = ref(false);
  const isSuccess = ref(false);
  const signUp = async (
    email: string,
    username: string,
    password: string,
    confirmPassword: string
  ) => {
    if (password !== confirmPassword) {
      useAlertStore().showAlert('Passwords do not match', AlertTypes.Warning);
      return false;
    }
    try {
      isSuccess.value = false;
      isLoading.value = true;
      await UserApi.signUp(email, username, password);
      isSuccess.value = true;
    } catch (error) {
      handleNetworkError(error);
    } finally {
      isLoading.value = false;
    }
  };
  return { signUp, isLoading, isSuccess };
};
