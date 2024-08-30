<script setup lang="ts">
import { useAlertStore } from '@/stores/alertStore';
import { useUserStore } from '@/stores/userStore';
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import VOtpInput from 'vue3-otp-input';

const email = ref('');
const code = ref('');
const password = ref('');

const isCodeSent = ref(false);

const router = useRouter();
const userStore = useUserStore();
const alertStore = useAlertStore();

const buttonTitle = computed(() => (isCodeSent.value ? 'Change password' : 'Reset password'));

const onSubmit = async () => {
  if (!isCodeSent.value) {
    const isSent = await userStore.requestCode(email.value);
    if (isSent) {
      isCodeSent.value = true;
      alertStore.showAlert('Code sent to your email');
    }
  } else {
    const isChanged = await userStore.resetPassword(email.value, code.value, password.value);
    if (isChanged) {
      alertStore.showAlert('Password changed successfully');
      router.push('/login');
    }
  }
};
</script>

<template>
  <form class="space-y-3" @submit.prevent="onSubmit">
    <div>
      <label for="email" class="block text-sm font-medium">Email address</label>
      <div class="mt-1">
        <input
          v-model="email"
          name="email"
          type="email"
          autocomplete="email"
          required
          :disabled="isCodeSent"
          class="block w-full rounded-md py-1.5 px-2 border border-gray-main placeholder:text-gray-400 leading-4"
        />
      </div>
    </div>
    <div v-if="isCodeSent">
      <label for="code" class="block text-sm font-medium">Code</label>
      <div class="mt-1">
        <v-otp-input
          :num-inputs="6"
          v-model:value="code"
          input-classes="otp-input rounded-md"
          inputType="letter-numeric"
          inputmode="text"
        />
      </div>
    </div>
    <div v-if="isCodeSent">
      <label for="password" class="block text-sm font-medium">New password</label>
      <div class="mt-1">
        <input
          v-model="password"
          name="password"
          type="password"
          required
          class="block w-full rounded-md py-1.5 px-2 border border-gray-main placeholder:text-gray-400 leading-4"
        />
      </div>
    </div>
    <button
      type="submit"
      class="mt-10 flex w-full justify-center rounded-md bg-blue-dark px-3 py-2.5 text-sm font-semibold text-white hover:bg-blue-light transition-all"
    >
      {{ buttonTitle }}
    </button>
  </form>
</template>

<style lang="scss">
.otp-input-container {
  justify-content: space-between;
  gap: 10px;

  & > div {
    .otp-input {
      height: 34px;
      width: 100%;
      font-size: 22px;
      border: 1px solid $gray-main;
      text-align: center;
      text-transform: uppercase;

      &.disabled {
        background-color: color-mix(in srgb, $white 100%, $yellow-secondary 30%);
        pointer-events: none;
      }
    }
  }
}
</style>
