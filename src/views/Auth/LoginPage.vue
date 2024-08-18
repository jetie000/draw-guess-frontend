<script setup lang="ts">
import { ref } from 'vue'

const formData = ref({
  email: '',
  password: ''
})
const onSubmit = () => {
  console.log(formData.value.email, formData.value.password)
}
</script>
<template>
  <div class="flex flex-col justify-center px-6 py-12 lg:px-8 my-auto">
    <div class="sm:mx-auto sm:w-full sm:max-w-sm">
      <img class="mx-auto h-10 w-auto" src="@/assets/duck-icon.svg" alt="Draw & Guess" />
      <h2 class="mt-8 text-center text-2xl font-bold">Sign in to your account</h2>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-sm">
      <form class="space-y-6" @submit.prevent="onSubmit">
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
              class="block w-full rounded-md border-0 py-1.5 px-2 ring-1 placeholder:text-gray-400 leading-4"
            />
          </div>
        </div>

        <div>
          <div class="flex items-center justify-between">
            <label for="password" class="block text-sm font-medium">Password</label>
            <div class="text-sm">
              <a href="/reset-password" class="font-semibold">Forgot password?</a>
            </div>
          </div>
          <div class="mt-2">
            <input
              v-model="formData.password"
              id="password"
              name="password"
              type="password"
              autocomplete="current-password"
              required
              class="block w-full rounded-md border-0 py-1.5 px-2 ring-1 placeholder:text-gray-400 leading-4"
            />
          </div>
        </div>

        <div>
          <button
            type="submit"
            class="flex w-full justify-center rounded-md bg-blue px-3 py-2.5 text-sm font-semibold text-white hover:bg-blue-light transition-all"
          >
            Sign in
          </button>
        </div>
      </form>
      <p class="mt-10 text-center text-sm text-gray-500">Not a member?</p>
    </div>
  </div>
</template>
