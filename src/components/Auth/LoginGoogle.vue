<script setup lang="ts">
import { decodeCredential, googleTokenLogin } from 'vue3-google-login';
import googleIcon from '@/assets/google.svg';

const callback = () => {
  googleTokenLogin()
    .then((res) => {
      const userData = decodeCredential(res.access_token);
      console.log(userData);
    })
    .catch((err) => {
      if (err.type !== 'popup_closed') {
        console.log(err);

        // TODO: handle error
      }
    });
};
</script>

<template>
  <button
    class="mt-8 self-center flex justify-center w-full items-center gap-2 border p-1.5 rounded-md bg-white"
    @click="callback"
  >
    <img class="inline w-5 h-5" :src="googleIcon" alt="Google" />Google
  </button>
</template>
