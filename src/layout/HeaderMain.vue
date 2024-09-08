<script setup lang="ts">
import duckIcon from '@/assets/duck-icon.svg';
import { useUserStore } from '@/stores/user/userStore';
import { ArrowRightIcon } from '@heroicons/vue/16/solid';
import { ArrowLeftStartOnRectangleIcon } from '@heroicons/vue/16/solid';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';

const router = useRouter();
const userStore = useUserStore();
const { token } = storeToRefs(userStore);

// TODO: move logout when profile page will be added
const handleLogout = () => {
  userStore.logout();
  router.push('/login');
};
</script>

<template>
  <header
    class="text-blue-dark bg-white p-2 h-12 flex justify-center sticky top-0 border-b border-blue-dark"
  >
    <div class="container flex justify-center items-center flex-grow px-4">
      <h1
        class="cursor-pointer"
        @click="$router.push('/')"
      >
        Draw
        <img
          class="w-6 h-6 inline"
          :src="duckIcon"
          alt="Logo"
        />
        Guess
      </h1>
      <button
        v-if="token"
        class="flex items-center gap-1.5 ml-auto hover:bg-blue-dark hover:text-white transition-all px-3 py-1 rounded-full"
        @click="handleLogout"
      >
        Log out <ArrowLeftStartOnRectangleIcon class="inline w-5 h-5" />
      </button>
      <button
        v-else
        class="flex items-center gap-1 ml-auto hover:bg-blue-dark hover:text-white transition-all px-3 py-1 rounded-full"
      >
        <RouterLink to="/login">Log in</RouterLink> <ArrowRightIcon class="inline w-5 h-5" />
      </button>
    </div>
  </header>
</template>
