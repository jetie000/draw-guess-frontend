<script setup lang="ts">
import { computed, ref } from 'vue';
import VOtpInput from 'vue3-otp-input';

const email = ref('');
const code = ref('');
const password = ref('');

const isCodeSent = ref(false);
const isCodeAccepted = ref(false);

const buttonTitle = computed(() => {
  if (!isCodeSent.value && !isCodeAccepted.value) {
    return 'Reset password';
  } else if (isCodeSent.value && !isCodeAccepted.value) {
    return 'Verify code';
  } else {
    return 'Change password';
  }
});

const onSubmit = () => {
  if (!isCodeSent.value && !isCodeAccepted.value) {
    console.log(email.value);
    isCodeSent.value = true;
  } else if (isCodeSent.value) {
    console.log(code.value);
    isCodeAccepted.value = true;
  } else {
    console.log(password.value);
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
          :input-classes="`${isCodeAccepted && 'disabled'} otp-input rounded-md`"
          inputType="letter-numeric"
        />
      </div>
    </div>
    <div v-if="isCodeAccepted">
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
      class="mt-10 flex w-full justify-center rounded-md bg-blue px-3 py-2.5 text-sm font-semibold text-white hover:bg-blue-light transition-all"
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
