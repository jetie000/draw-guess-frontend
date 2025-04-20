<script setup lang="ts">
import googleIcon from '@/assets/google.svg';
import { useAlertStore } from '@/stores/alert/alertStore';
import { useUserStore } from '@/stores/user/userStore';
import { useRouter } from 'vue-router';
import { useMutation, useQueryClient } from '@tanstack/vue-query';
import { UserApi } from '@/api/user/user.api';
import { googleTokenLogin } from 'vue3-google-login';
import { handleNetworkError } from '@/helpers/errors';
import { QueryKeys } from '@/api/query-keys';

const router = useRouter();
const userStore = useUserStore();
const alertStore = useAlertStore();

const queryClient = useQueryClient();

const { mutate } = useMutation({
  mutationFn: async () => {
    const { access_token } = await googleTokenLogin();
    return await UserApi.loginGoogle(access_token);
  },
  onSuccess: ({ accessToken }) => {
    userStore.setToken(accessToken);
    queryClient.resetQueries({ queryKey: [QueryKeys.Profile] });
    router.push('/');
    alertStore.showAlert('Successfully logged in');
  },
  onError: (error) => {
    handleNetworkError(error);
  }
});
</script>

<template>
  <button
    class="mt-8 self-center flex justify-center w-full items-center gap-2 border p-1.5 rounded-md bg-white"
    @click="mutate()"
  >
    <img
      class="inline w-5 h-5"
      :src="googleIcon"
      alt="Google"
    />
    Google
  </button>
</template>
