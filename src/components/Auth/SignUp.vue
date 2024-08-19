<script setup lang="ts">
import { ref } from 'vue';

const formData = ref({
  email: '',
  username: '',
  password: '',
  confirmPassword: ''
});

const onSubmit = () => {
  console.log(
    formData.value.email,
    formData.value.username,
    formData.value.password,
    formData.value.confirmPassword
  );
};
</script>

<template>
  <form class="space-y-4" @submit.prevent="onSubmit">
    <div>
      <label for="email" class="block text-sm font-medium">Email address</label>
      <div class="mt-2">
        <input
          v-model="formData.email"
          id="email"
          name="email"
          type="email"
          autocomplete="email"
          required
          class="block w-full rounded-md py-1.5 px-2 border border-gray-main placeholder:text-gray-400 leading-4"
        />
      </div>
    </div>
    <div>
      <label for="username" class="block text-sm font-medium">Username</label>
      <div class="mt-2">
        <input
          v-model="formData.username"
          id="username"
          name="username"
          type="username"
          required
          class="block w-full rounded-md py-1.5 px-2 border border-gray-main placeholder:text-gray-400 leading-4"
        />
      </div>
    </div>
    <div>
      <label for="password" class="block text-sm font-medium">Password</label>
      <div class="mt-2">
        <input
          v-model="formData.password"
          id="password"
          name="password"
          type="password"
          required
          class="block w-full rounded-md py-1.5 px-2 border border-gray-main placeholder:text-gray-400 leading-4"
        />
      </div>
    </div>
    <div>
      <label for="confirmPassword" class="block text-sm font-medium">Confirm password</label>
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
    <button
      type="submit"
      class="flex w-full justify-center rounded-md bg-blue px-3 py-2.5 text-sm font-semibold text-white hover:bg-blue-light transition-all"
    >
      Sign up
    </button>
  </form>
</template>
