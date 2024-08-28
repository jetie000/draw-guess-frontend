<script setup lang="ts">
import googleIcon from '@/assets/google.svg';
import { useUserStore } from '@/stores/userStore';
import { useRouter } from 'vue-router';

const router = useRouter();
const userStore = useUserStore();

const handleLogin = async () => {
  const isAuth = await userStore.loginByGoogle();
  if (isAuth) {
    router.push('/');
  }
};
</script>

<template>
  <button
    class="mt-8 self-center flex justify-center w-full items-center gap-2 border p-1.5 rounded-md bg-white"
    @click="handleLogin"
  >
    <img class="inline w-5 h-5" :src="googleIcon" alt="Google" />Google
  </button>
</template>
