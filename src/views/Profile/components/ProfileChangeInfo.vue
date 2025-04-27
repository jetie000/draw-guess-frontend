<script setup lang="ts">
import { QueryKeys } from '@/api/query-keys';
import { UserApi } from '@/api/user/user.api';
import type { PatchUserRequest, Profile } from '@/api/user/user.api.interface';
import ButtonMain from '@/components/Button/ButtonMain.vue';
import InputMain from '@/components/Input/InputMain.vue';
import Spinner from '@/components/Spinner/Spinner.vue';
import { getErrorMessage, handleNetworkError } from '@/helpers/errors';
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query';
import { ref, watch } from 'vue';
import ResetPassword from '@/components/ResetPasswordForm/ResetPassword.vue';
import { AccountTypes } from '@/typings/enums/user';
import { useUserStore } from '@/stores/user/userStore';
import { useAlertStore } from '@/stores/alert/alertStore';
import SpinnerCenter from '@/components/Spinner/SpinnerCenter.vue';

const userStore = useUserStore();
const alertStore = useAlertStore();
const queryClient = useQueryClient();

const { data, isLoading, isError, error, isSuccess } = useQuery({
  queryKey: [QueryKeys.Profile],
  queryFn: UserApi.profile
});

watch(isLoading, () => {
  if (isSuccess.value && data.value) {
    user.value = { ...data.value };
  }
});

const user = ref<Profile | undefined>(data.value && { ...data.value });

const { mutate: changeInfo, isPending } = useMutation({
  mutationFn: (profile: PatchUserRequest) => UserApi.patchMe(profile),
  onSuccess: ({ accessToken }) => {
    userStore.setToken(accessToken);
    alertStore.showAlert('Successfully updated profile');
    queryClient.setQueryData([QueryKeys.Profile], { ...user.value });
  },
  onError: (error) => {
    handleNetworkError(error);
  }
});

const onProfileChangeSubmit = () => {
  if (user.value) {
    changeInfo(user.value);
  }
};
</script>

<template>
  <div class="flex flex-col items-center gap-3">
    <SpinnerCenter v-if="isLoading" />
    <p
      class="m-auto text-lg"
      v-else-if="isError"
    >
      {{ getErrorMessage(error) }}
    </p>
    <template v-else-if="data && user">
      <h3 class="font-bold text-lg">Change info</h3>
      <form
        class="flex flex-col max-w-64"
        @submit.prevent="onProfileChangeSubmit"
      >
        <label
          class="text-sm"
          for="change-username"
        >
          Username
        </label>
        <InputMain
          v-model.trim="user.username"
          class="mt-1"
          name="change-username"
          required
        />
        <ButtonMain
          class="mt-3 w-full"
          :disabled="isPending || user?.username === data?.username"
          type="submit"
        >
          <Spinner v-if="isPending" />
          <template v-else> Change </template>
        </ButtonMain>
      </form>
      <template v-if="data.type === AccountTypes.Email">
        <h3 class="font-bold text-lg mt-3">Change password</h3>
        <ResetPassword
          class="max-w-64"
          :user-email="data.email"
        />
      </template>
    </template>
  </div>
</template>
