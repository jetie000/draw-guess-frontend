<script setup lang="ts">
import { QueryKeys } from '@/api/query-keys';
import { UserApi } from '@/api/user/user.api';
import duckIcon from '@/assets/duck-icon.svg';
import { useModalStore } from '@/stores/modal/modalStore';
import { useUserStore } from '@/stores/user/userStore';
import { UserRoles } from '@/typings/enums/user';
import { ArrowRightIcon } from '@heroicons/vue/16/solid';
import { useQuery } from '@tanstack/vue-query';
import { storeToRefs } from 'pinia';
import { onMounted, watch } from 'vue';
import { useSettingsStore } from '@/stores/settingsStore';
import musicFile from '@/assets/sounds/friendly-town-menu-music.mp3';
import UserDropdown from './UserDropdown.vue';

const userStore = useUserStore();
const { token } = storeToRefs(userStore);
const settingsStore = useSettingsStore();

const { isFetching, isError, data, error, refetch } = useQuery({
  queryKey: [QueryKeys.Profile],
  queryFn: UserApi.profile,
  enabled: false
});

watch(isFetching, () => {
  if (isError.value) {
    useModalStore().showErrorModal(error.value);
  }
});

watch(
  token,
  (newToken, oldToken) => {
    if (!oldToken && newToken) {
      refetch();
    }
  },
  { immediate: true }
);

onMounted(() => {
  settingsStore.playMusic(musicFile);
});
</script>

<template>
  <header
    class="text-blue-dark bg-white p-2 h-12 flex justify-center sticky top-0 border-b z-10 border-blue-dark"
  >
    <div class="container flex justify-center items-center flex-grow px-4 max-xsm:px-2">
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
        v-if="data && data.role === UserRoles.Admin"
        class="hover:bg-blue-dark hover:text-white transition-all ml-4 px-3 py-1 rounded-full"
        @click="$router.push('/admin')"
      >
        Admin
      </button>
      <UserDropdown
        v-if="token"
        :user="data"
      />
      <button
        v-else
        class="flex items-center gap-1 ml-auto hover:bg-blue-dark hover:text-white transition-all px-3 py-1 rounded-full"
      >
        <RouterLink to="/login">Log in</RouterLink> <ArrowRightIcon class="inline w-5 h-5" />
      </button>
    </div>
  </header>
</template>
