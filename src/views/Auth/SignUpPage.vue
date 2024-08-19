<script setup lang="ts">
import SignUp from '@/components/Auth/SignUp.vue';
</script>

<template>
  <div class="flex flex-col justify-center px-6 py-12 lg:px-8 my-auto">
    <div class="sm:mx-auto sm:w-full sm:max-w-sm">
      <img class="mx-auto h-10 w-auto" src="@/assets/duck-icon.svg" alt="Draw & Guess" />
      <h2 class="mt-6 text-center text-2xl font-bold">Sign up</h2>
    </div>
    <div class="mt-6 sm:mx-auto sm:w-full sm:max-w-sm">
      <SignUp />
      <p class="mt-4 text-center text-sm text-gray-500">
        Already a member?
        <RouterLink to="/login" class="font-bold ml-2">Sign in</RouterLink>
      </p>
    </div>
  </div>
</template>
