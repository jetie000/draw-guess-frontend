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
  <div class="p-4 flex max-md:flex-col gap-4">
    <div class="flex flex-col gap-2 max-md:px-3">
      <h1 class="text-xl text-center font-bold mb-3">Admin page</h1>
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
      class="flex-1 overflow-y-auto max-h-[calc(100vh-7rem)] max-md:max-h-[calc(100vh-21rem)]"
    />
  </div>
</template>
