import { UserApi } from '@/api/user/user.api';
import { handleNetworkError } from '@/helpers/errors';
import { ref } from 'vue';

export const useRequestCode = () => {
  const isLoading = ref(false);
  const isSuccess = ref(false);

  const requestCode = async (email: string) => {
    try {
      isSuccess.value = false;
      isLoading.value = true;
      await UserApi.requestCode(email);
      isSuccess.value = true;
    } catch (error) {
      handleNetworkError(error);
    } finally {
      isLoading.value = false;
    }
  };

  return { requestCode, isLoading, isSuccess };
};
