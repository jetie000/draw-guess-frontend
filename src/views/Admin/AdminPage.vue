<script setup lang="ts">
import ButtonMain from '@/components/Button/ButtonMain.vue';
import { ref } from 'vue';
import AdminUsers from './components/AdminUsers.vue';
import AdminWords from './components/AdminWords.vue';
import AdminWordTypes from './components/AdminWordTypes.vue';

const tabIndex = ref(0);

const tabs = [
  {
    title: 'Users',
    component: AdminUsers
  },
  {
    title: 'Words',
    component: AdminWords
  },
  {
    title: 'Word Types',
    component: AdminWordTypes
  }
];
</script>

<template>
  <div class="p-4 flex">
    <div class="flex flex-col gap-2 me-4">
      <h1 class="text-xl mb-4">Admin page</h1>
      <ButtonMain
        v-for="(tab, index) in tabs"
        :key="tab.title"
        :theme="tabIndex === index ? 'primary' : 'secondary'"
        @click="tabIndex = index"
      >
        {{ tab.title }}
      </ButtonMain>
    </div>
    <component
      :is="tabs[tabIndex].component"
      class="flex-1"
    />
  </div>
</template>
