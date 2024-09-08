<script setup lang="ts">
import { useAlertStore } from '@/stores/alert/alertStore';
import { ref } from 'vue';
import { useSignUp } from '../api/useSignUp';
import Spinner from '@/components/Spinner/Spinner.vue';
import ButtonMain from '@/components/Button/ButtonMain.vue';

const formData = ref({
  email: '',
  username: '',
  password: '',
  confirmPassword: ''
});

const alertStore = useAlertStore();
const { signUp, isLoading, isSuccess } = useSignUp();

const handleSignUp = async () => {
  await signUp(
    formData.value.email,
    formData.value.username,
    formData.value.password,
    formData.value.confirmPassword
  );
  if (isSuccess) {
    formData.value = {
      email: '',
      username: '',
      password: '',
      confirmPassword: ''
    };
    alertStore.showAlert('Signed up successfully');
  }
};
</script>

<template>
  <form
    class="space-y-4"
    @submit.prevent="handleSignUp"
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
          id="email"
          name="email"
          type="email"
          autocomplete="email"
          required
          class="w-full rounded-md py-1.5 px-2 border border-gray-main placeholder:text-gray-400 leading-4"
        />
      </div>
    </div>
    <div>
      <label
        for="username"
        class="block text-sm font-medium"
      >
        Username
      </label>
      <div class="mt-2">
        <input
          v-model="formData.username"
          id="username"
          name="username"
          type="username"
          required
          class="w-full rounded-md py-1.5 px-2 border border-gray-main placeholder:text-gray-400 leading-4"
        />
      </div>
    </div>
    <div>
      <label
        for="password"
        class="block text-sm font-medium"
      >
        Password
      </label>
      <div class="mt-2">
        <input
          v-model="formData.password"
          id="password"
          name="password"
          type="password"
          required
          class="w-full rounded-md py-1.5 px-2 border border-gray-main placeholder:text-gray-400 leading-4"
        />
      </div>
    </div>
    <div>
      <label
        for="confirmPassword"
        class="block text-sm font-medium"
      >
        Confirm password
      </label>
      <div class="mt-2">
        <input
          v-model="formData.confirmPassword"
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          required
          class="block w-full rounded-md border border-gray-main py-1.5 px-2 placeholder:text-gray-400 leading-4"
        />
      </div>
    </div>
    <ButtonMain
      type="submit"
      class="w-full"
    >
      <Spinner v-if="isLoading" />
      <span v-else>Sign up</span>
    </ButtonMain>
  </form>
</template>
