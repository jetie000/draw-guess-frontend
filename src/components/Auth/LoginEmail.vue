<script setup lang="ts">
import { useUserStore } from '@/stores/userStore';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const formData = ref({
  email: '',
  password: ''
});

const router = useRouter();
const userStore = useUserStore();

const handleLogin = async () => {
  const isAuth = await userStore.loginByEmail(formData.value.email, formData.value.password);
  if (isAuth) {
    router.push('/');
  }
};
</script>

<template>
  <form class="space-y-6" @submit.prevent="handleLogin">
    <div>
      <label for="email" class="block text-sm font-medium">Email address</label>
      <div class="mt-2">
        <input
          v-model="formData.email"
          name="email"
          type="email"
          autocomplete="email"
          required
          class="block w-full rounded-md py-1.5 px-2 border border-gray-main placeholder:text-gray-400 leading-4"
        />
      </div>
    </div>
    <div>
      <div class="flex items-center justify-between">
        <label for="password" class="block text-sm font-medium">Password</label>
        <div class="text-sm">
          <RouterLink to="/reset-password" class="font-semibold">Forgot password?</RouterLink>
        </div>
      </div>
      <div class="mt-2">
        <input
          v-model="formData.password"
          name="password"
          type="password"
          required
          class="block w-full rounded-md py-1.5 px-2 border border-gray-main placeholder:text-gray-400 leading-4"
        />
      </div>
    </div>
    <button
      type="submit"
      class="flex w-full justify-center rounded-md bg-blue px-3 py-2.5 text-sm font-semibold text-white hover:bg-blue-light transition-all"
    >
      Sign in
    </button>
  </form>
</template>
