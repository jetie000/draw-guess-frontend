<script setup lang="ts">
import { useAlertStore } from '@/stores/alert/alertStore';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useLoginByEmail } from '../api/useLoginByEmail';
import { useUserStore } from '@/stores/user/userStore';
import Spinner from '@/components/Spinner/Spinner.vue';
import ButtonMain from '@/components/Button/ButtonMain.vue';

const formData = ref({
  email: '',
  password: ''
});

const router = useRouter();
const userStore = useUserStore();
const alertStore = useAlertStore();
const { loginByEmail, isSuccess, isLoading } = useLoginByEmail();

const handleLogin = async () => {
  const accessToken = await loginByEmail(formData.value.email, formData.value.password);
  if (isSuccess.value && accessToken) {
    userStore.login(accessToken);
    router.push('/');
    alertStore.showAlert('Successfully logged in');
  }
};
</script>

<template>
  <form
    class="space-y-6"
    @submit.prevent="handleLogin"
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
          v-model="formData.email"
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
          v-model="formData.password"
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
      <Spinner v-if="isLoading" />
      <span v-else>Sign in</span>
    </ButtonMain>
  </form>
</template>
