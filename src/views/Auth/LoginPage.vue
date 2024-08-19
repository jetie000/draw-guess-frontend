<script setup lang="ts">
import LoginEmail from '@/components/Auth/LoginEmail.vue';
import LoginGoogle from '@/components/Auth/LoginGoogle.vue';
</script>

<template>
  <div class="flex flex-col justify-center px-6 py-12 lg:px-8 my-auto">
    <div class="sm:mx-auto sm:w-full sm:max-w-sm">
      <img class="mx-auto h-10 w-auto" src="@/assets/duck-icon.svg" alt="Draw & Guess" />
      <h2 class="mt-8 text-center text-2xl font-bold">Sign in to your account</h2>
    </div>
    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-sm">
      <LoginEmail />
      <p class="mt-4 text-center text-sm text-gray-500">
        Not a member?
        <RouterLink to="/sign-up" class="font-bold ml-2">Sign up now</RouterLink>
      </p>
      <div class="mt-8 text-center relative">
        <span class="bg-yellow-secondary absolute -translate-y-1/2 -translate-x-1/2 px-2"
          >or sign in with</span
        >
        <hr class="w-full" />
      </div>
      <LoginGoogle />
    </div>
  </div>
</template>
