<script setup lang="ts">
import { QueryKeys } from '@/api/query-keys';
import { UserApi } from '@/api/user/user.api';
import duckIcon from '@/assets/duck-icon.svg';
import Dropdown from '@/components/Dropdown/Dropdown.vue';
import { handleNetworkError } from '@/helpers/errors';
import { useModalStore } from '@/stores/modal/modalStore';
import { useUserStore } from '@/stores/user/userStore';
import { UserRoles } from '@/typings/enums/user';
import { ArrowRightIcon } from '@heroicons/vue/16/solid';
import { ArrowLeftStartOnRectangleIcon } from '@heroicons/vue/16/solid';
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query';
import { storeToRefs } from 'pinia';
import { computed, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import userIcon from '@/assets/user.svg';
import { getLevelAndProgressByExp } from '@/helpers/game';

const router = useRouter();
const userStore = useUserStore();
const { token } = storeToRefs(userStore);

const queryClient = useQueryClient();
const dropdown = ref<InstanceType<typeof Dropdown> | null>(null);

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

const replaceAvatarByDefault = (event: Event) => {
  (event.target as HTMLImageElement).src = userIcon;
};
const levelAndProgress = computed(
  () => data.value && getLevelAndProgressByExp(data.value.experience)
);
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
      <Dropdown
        v-if="token"
        ref="dropdown"
        class="flex ml-auto"
        trigger-wrapper-class="flex"
        align="right"
      >
        <template #trigger>
          <button
            :disabled="isPending"
            class="transition-all rounded-full border border-transparent hover:border-blue-dark relative"
          >
            <img
              class="w-8 h-8 rounded-full"
              :src="data?.avatarUrl || userIcon"
              alt="Avatar"
              @error="replaceAvatarByDefault"
            />
            <template v-if="levelAndProgress">
              <div
                class="absolute h-4 min-w-4 -top-1 left-5 text-xs text-center align-middle px-1 rounded-full border border-blue-dark"
                :style="{
                  background: levelAndProgress.background,
                  color: levelAndProgress.color
                }"
              >
                {{ levelAndProgress.level }}
              </div>
              <div
                class="absolute left-1 -bottom-1 w-6 h-1.5 border border-blue-dark"
                :style="{
                  background: levelAndProgress.background
                }"
              >
                <div
                  :style="{
                    background: levelAndProgress.color,
                    width: `${levelAndProgress.progress}%`,
                    height: '100%'
                  }"
                />
              </div>
            </template>
          </button>
        </template>
        <div class="flex bg-white border rounded-md py-2 flex-col">
          <RouterLink
            to="/profile"
            class="cursor-pointer hover:bg-blue-100 py-1 px-4 text-center"
            @click="() => dropdown?.hideMenu()"
          >
            My Profile
          </RouterLink>
          <div
            class="flex items-center gap-2 flex-nowrap px-4 py-1 hover:bg-blue-100 cursor-pointer"
            @click="() => !isPending && logout()"
          >
            <span class="whitespace-nowrap">Log out</span>
            <ArrowLeftStartOnRectangleIcon class="inline w-5 h-5 shrink-0" />
          </div>
        </div>
      </Dropdown>

      <button
        v-else
        class="flex items-center gap-1 ml-auto hover:bg-blue-dark hover:text-white transition-all px-3 py-1 rounded-full"
      >
        <RouterLink to="/login">Log in</RouterLink> <ArrowRightIcon class="inline w-5 h-5" />
      </button>
    </div>
  </header>
</template>
