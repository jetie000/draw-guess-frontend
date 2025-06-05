<script setup lang="ts">
import ButtonMain from '@/components/Button/ButtonMain.vue';
import Panel from '@/components/Panel/Panel.vue';
import SpinnerCenter from '@/components/Spinner/SpinnerCenter.vue';
import { CheckIcon, PencilSquareIcon, XMarkIcon } from '@heroicons/vue/24/outline';
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query';
import { useModalStore } from '@/stores/modal/modalStore';
import { QueryKeys } from '@/api/query-keys';
import { UserApi } from '@/api/user/user.api';
import { ref, watch } from 'vue';
import type { PatchUserRequestAdmin } from '@/api/user/user.api.interface';
import { formatDate } from '@/helpers/datetime';
import ChangeUserModal from './ChangeUserModal.vue';
import { handleNetworkError } from '@/helpers/errors';
import { AccountTypes, UserRoles } from '@/typings/enums/user';

const queryClient = useQueryClient();

const { isLoading, isError, error, data } = useQuery({
  queryKey: [QueryKeys.Users],
  queryFn: UserApi.getAll
});

watch(isLoading, () => {
  if (isError.value) {
    useModalStore().showErrorModal(error.value);
  }
});

const changingUser = ref<PatchUserRequestAdmin | undefined>(undefined);

const { mutate: changeUser, isPending: isPendingChange } = useMutation({
  mutationFn: (userData: PatchUserRequestAdmin) => UserApi.patchUser(userData),
  onSuccess: (user) => {
    queryClient.setQueryData(
      [QueryKeys.Users],
      data.value?.map((u) => (u.id === user.id ? user : u))
    );
    changingUser.value = undefined;
  },
  onError: (error) => {
    handleNetworkError(error);
  }
});

const AccountTypesNames = Object.values(AccountTypes);
const UserRolesNames = Object.values(UserRoles);
</script>

<template>
  <SpinnerCenter v-if="isLoading" />
  <div
    v-else-if="isError"
    class="mx-auto"
  >
    Error message: {{ error }}
  </div>
  <div
    v-else
    class="flex flex-col grow gap-1 px-3"
  >
    <Panel
      v-if="data?.length"
      class="overflow-auto"
      no-padding
    >
      <table class="min-w-full">
        <thead>
          <tr class="max-lg:flex max-lg:items-center max-lg:flex-wrap">
            <th class="p-2 text-left max-lg:text-center max-lg:w-1/3">ID</th>
            <th class="p-2 text-left max-lg:text-center max-lg:w-2/3">Email</th>
            <th class="p-2 text-left max-lg:text-center max-lg:w-2/3">Username</th>
            <th class="p-2 max-lg:hidden">Join Date</th>
            <th class="p-2 max-lg:hidden">Login Date</th>
            <th class="p-2 max-lg:w-1/3">Role</th>
            <th class="p-2 max-lg:w-1/3">Account Type</th>
            <th class="p-2 max-lg:w-1/3">Access</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="user in data"
            :key="user.id"
            class="border-t border-blue-dark max-lg:flex max-lg:items-center max-lg:flex-wrap"
          >
            <td class="p-2 max-lg:text-center max-lg:w-1/3">
              {{ user.id }}
            </td>
            <td class="p-2 max-lg:text-center max-lg:w-2/3">
              {{ user.email }}
            </td>
            <td class="p-2 max-lg:text-center max-lg:w-2/3">
              {{ user.username }}
            </td>
            <td class="p-2 text-center max-lg:hidden">
              {{ formatDate(user.joinDate) }}
            </td>
            <td class="p-2 text-center max-lg:hidden">
              {{ formatDate(user.loginDate) }}
            </td>
            <td class="p-2 text-center max-lg:w-1/3">
              {{ UserRolesNames[user.role] }}
            </td>
            <td class="p-2 text-center max-lg:w-1/3">
              {{ AccountTypesNames[user.type] }}
            </td>
            <td class="p-2 max-lg:w-1/3">
              <CheckIcon
                v-if="user.access"
                class="w-5 h-5 m-auto"
              />
              <XMarkIcon
                v-else
                class="w-5 h-5 m-auto"
              />
            </td>
            <td class="max-lg:w-1/3">
              <ButtonMain
                class="ml-auto my-auto max-lg:m-auto"
                theme="primary"
                size="md"
                @click="changingUser = { ...user, password: '' }"
              >
                <PencilSquareIcon class="w-5 h-5" />
              </ButtonMain>
            </td>
          </tr>
        </tbody>
      </table>
    </Panel>
    <ChangeUserModal
      :is-change-modal-open="changingUser !== undefined"
      :user="changingUser"
      :is-loading="isPendingChange"
      @pressed="changingUser && changeUser(changingUser)"
      @closed="changingUser = undefined"
    />
  </div>
</template>
