import { UserApi } from '@/api/user/user.api';
import { handleNetworkError } from '@/helpers/errors';
import { ref } from 'vue';
import { googleTokenLogin } from 'vue3-google-login';

export const useLoginByGoogle = () => {
  const isLoading = ref(false);
  const isSuccess = ref(false);

  const loginByGoogle = async () => {
    try {
      isSuccess.value = false;
      isLoading.value = true;
      const { access_token } = await googleTokenLogin();
      const { accessToken } = await UserApi.loginGoogle(access_token);
      isSuccess.value = true;
      return accessToken;
    } catch (error) {
      if (error instanceof Error && 'type' in error && error.type === 'popup_closed') {
        return;
      }
      handleNetworkError(error);
    } finally {
      isLoading.value = false;
    }
  };

  return { loginByGoogle, isLoading, isSuccess };
};
