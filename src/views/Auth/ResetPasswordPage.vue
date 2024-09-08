<script setup lang="ts">
import ResetPassword from './components/ResetPassword.vue';
</script>

<template>
  <div class="flex flex-col justify-center px-6 py-12 lg:px-8 my-auto">
    <div class="sm:mx-auto sm:w-full sm:max-w-sm">
      <img
        class="mx-auto h-10 w-auto"
        src="@/assets/duck-icon.svg"
        alt="Draw & Guess"
      />
      <h2 class="mt-4 text-center text-2xl font-bold">Reset password</h2>
    </div>
    <div class="mt-4 sm:mx-auto sm:w-full sm:max-w-sm">
      <ResetPassword />
    </div>
  </div>
</template>
