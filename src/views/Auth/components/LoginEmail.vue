<script setup lang="ts">
import { useAlertStore } from '@/stores/alert/alertStore';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user/userStore';
import Spinner from '@/components/Spinner/Spinner.vue';
import ButtonMain from '@/components/Button/ButtonMain.vue';
import { useMutation } from '@tanstack/vue-query';
import { UserApi } from '@/api/user/user.api';
import { handleNetworkError } from '@/helpers/errors';

const formData = ref({
  email: '',
  password: ''
});

const router = useRouter();
const userStore = useUserStore();
const alertStore = useAlertStore();

const { isPending, mutate } = useMutation({
  mutationFn: () => UserApi.login(formData.value.email, formData.value.password),
  onSuccess: ({ accessToken }) => {
    userStore.setToken(accessToken);
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
        <input
          v-model.trim="formData.email"
          name="email"
          type="email"
          autocomplete="email"
          required
          class="w-full rounded-md py-1.5 px-2 border border-gray-main placeholder:text-gray-400 leading-4"
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
        <input
          v-model.trim="formData.password"
          name="password"
          type="password"
          required
          class="w-full rounded-md py-1.5 px-2 border border-gray-main placeholder:text-gray-400 leading-4"
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
