<script setup lang="ts">
import googleIcon from '@/assets/google.svg';
import { useAlertStore } from '@/stores/alert/alertStore';
import { useUserStore } from '@/stores/user/userStore';
import { useRouter } from 'vue-router';
import { useLoginByGoogle } from '../api/useLoginByGoogle';

const router = useRouter();
const userStore = useUserStore();
const alertStore = useAlertStore();
const { loginByGoogle, isSuccess } = useLoginByGoogle();

const handleLogin = async () => {
  const accessToken = await loginByGoogle();
  if (isSuccess.value && accessToken) {
    userStore.login(accessToken);
    router.push('/');
    alertStore.showAlert('Successfully logged in');
  }
};
</script>

<template>
  <button
    class="mt-8 self-center flex justify-center w-full items-center gap-2 border p-1.5 rounded-md bg-white"
    @click="handleLogin"
  >
    <img
      class="inline w-5 h-5"
      :src="googleIcon"
      alt="Google"
    />
    Google
  </button>
</template>
