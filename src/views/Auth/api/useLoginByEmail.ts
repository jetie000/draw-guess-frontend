import { UserApi } from '@/api/user/user.api';
import { handleNetworkError } from '@/helpers/errors';
import { ref } from 'vue';

export const useLoginByEmail = () => {
  const isLoading = ref(false);
  const isSuccess = ref(false);

  const loginByEmail = async (email: string, password: string) => {
    try {
      isSuccess.value = false;
      isLoading.value = true;
      const { accessToken } = await UserApi.login(email, password);
      isSuccess.value = true;
      return accessToken;
    } catch (error) {
      handleNetworkError(error);
    } finally {
      isLoading.value = false;
    }
  };

  return { loginByEmail, isLoading, isSuccess };
};
