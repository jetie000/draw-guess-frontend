import { UserApi } from '@/api/user/user.api';
import { handleNetworkError } from '@/helpers/errors';
import { ref } from 'vue';

export const useResetPassword = () => {
  const isLoading = ref(false);
  const isSuccess = ref(false);

  const resetPassword = async (email: string, code: string, password: string) => {
    try {
      isSuccess.value = false;
      isLoading.value = true;
      await UserApi.resetPassword(email, code, password);
      isSuccess.value = true;
    } catch (error) {
      handleNetworkError(error);
    } finally {
      isLoading.value = false;
    }
  };

  return { resetPassword, isLoading, isSuccess };
};
