<script setup lang="ts">
import { QueryKeys } from '@/api/query-keys';
import { UserApi } from '@/api/user/user.api';
import duckIcon from '@/assets/duck-icon.svg';
import { handleNetworkError } from '@/helpers/errors';
import { useErrorModalStore } from '@/stores/errorModal/errorModalStore';
import { useUserStore } from '@/stores/user/userStore';
import { UserRoles } from '@/typings/enums/user';
import { ArrowRightIcon } from '@heroicons/vue/16/solid';
import { ArrowLeftStartOnRectangleIcon } from '@heroicons/vue/16/solid';
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query';
import { storeToRefs } from 'pinia';
import { watch } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const userStore = useUserStore();
const { token } = storeToRefs(userStore);

const queryClient = useQueryClient();

const { isFetching, isError, data, error, refetch } = useQuery({
  queryKey: [QueryKeys.Profile],
  queryFn: UserApi.profile,
  enabled: false
});

// TODO: move logout when profile page will be added
const { mutate: logout, isPending } = useMutation({
  mutationFn: UserApi.logout,
  onSuccess: () => {
    userStore.removeToken();
    router.push('/login');
    queryClient.resetQueries({ queryKey: [QueryKeys.Profile] });
    queryClient.clear();
  },
  onError: (logoutError) => {
    handleNetworkError(logoutError);
  }
});

watch(isFetching, () => {
  if (isError.value) {
    useErrorModalStore().showModal(error.value);
  }
});

watch(token, () => {
  if (token.value) {
    refetch();
  }
});
</script>

<template>
  <header
    class="text-blue-dark bg-white p-2 h-12 flex justify-center sticky top-0 border-b border-blue-dark"
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
      <button
        v-if="token"
        :disabled="isPending"
        class="flex items-center gap-1.5 ml-auto hover:bg-blue-dark hover:text-white transition-all px-3 py-1 rounded-full"
        @click="() => logout()"
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
