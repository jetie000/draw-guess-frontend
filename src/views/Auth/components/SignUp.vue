<script setup lang="ts">
import { useAlertStore } from '@/stores/alert/alertStore';
import { ref } from 'vue';
import Spinner from '@/components/Spinner/Spinner.vue';
import ButtonMain from '@/components/Button/ButtonMain.vue';
import { useMutation } from '@tanstack/vue-query';
import { UserApi } from '@/api/user/user.api';
import { handleNetworkError } from '@/helpers/errors';
import { AlertTypes } from '@/typings/enums/alert';
import InputMain from '@/components/Input/InputMain.vue';

const formData = ref({
  email: '',
  username: '',
  password: '',
  confirmPassword: ''
});

const alertStore = useAlertStore();

const { mutate, isPending } = useMutation({
  mutationFn: () =>
    UserApi.signUp(formData.value.email, formData.value.username, formData.value.password),
  onSuccess: () => {
    formData.value = {
      email: '',
      username: '',
      password: '',
      confirmPassword: ''
    };
    alertStore.showAlert('Signed up successfully');
  },
  onError: (error) => {
    handleNetworkError(error);
  }
});

const handleSignUp = async () => {
  if (formData.value.password !== formData.value.confirmPassword) {
    useAlertStore().showAlert('Passwords do not match', AlertTypes.Warning);
    return;
  }
  mutate();
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
        <InputMain
          v-model.trim="formData.email"
          id="email"
          name="email"
          type="email"
          autocomplete="email"
          required
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
        <InputMain
          v-model.trim="formData.username"
          id="username"
          name="username"
          type="username"
          required
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
        <InputMain
          v-model.trim="formData.password"
          id="password"
          name="password"
          type="password"
          required
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
        <InputMain
          v-model.trim="formData.confirmPassword"
          id="confirmPassword"
          name="confirmPassword"
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
      <span v-else>Sign up</span>
    </ButtonMain>
  </form>
</template>
