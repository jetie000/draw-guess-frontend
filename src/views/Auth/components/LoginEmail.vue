<script setup lang="ts">
import { useAlertStore } from '@/stores/alert/alertStore';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user/userStore';
import Spinner from '@/components/Spinner/Spinner.vue';
import ButtonMain from '@/components/Button/ButtonMain.vue';
import { useMutation, useQueryClient } from '@tanstack/vue-query';
import { UserApi } from '@/api/user/user.api';
import { handleNetworkError } from '@/helpers/errors';
import InputMain from '@/components/Input/InputMain.vue';

const formData = ref({
  email: '',
  password: ''
});

const queryClient = useQueryClient();

const router = useRouter();
const userStore = useUserStore();
const alertStore = useAlertStore();

const { isPending, mutate } = useMutation({
  mutationFn: () => UserApi.login(formData.value.email, formData.value.password),
  onSuccess: ({ accessToken }) => {
    userStore.setToken(accessToken);
    queryClient.resetQueries({ queryKey: ['profile'] });
    router.push('/');
    alertStore.showAlert('Successfully logged in');
  },
  onError: (error) => {
    handleNetworkError(error);
  }
});
</script>

<template>
  <form
    class="space-y-6"
    @submit.prevent="mutate()"
  >
    <div>
      <label
        for="email"
        class="block text-sm font-medium"
      >
        Email address
      </label>
      <div class="mt-2">
        <InputMain
          v-model.trim="formData.email"
          name="email"
          type="email"
          autocomplete="email"
          required
        />
      </div>
    </div>
    <div>
      <div class="flex items-center justify-between">
        <label
          for="password"
          class="block text-sm font-medium"
        >
          Password
        </label>
        <div class="text-sm">
          <RouterLink
            to="/reset-password"
            class="font-semibold"
          >
            Forgot password?
          </RouterLink>
        </div>
      </div>
      <div class="mt-2">
        <InputMain
          v-model.trim="formData.password"
          name="password"
          type="password"
          required
        />
      </div>
    </div>
    <ButtonMain
      type="submit"
      class="w-full"
    >
      <Spinner v-if="isPending" />
      <span v-else>Sign in</span>
    </ButtonMain>
  </form>
</template>
