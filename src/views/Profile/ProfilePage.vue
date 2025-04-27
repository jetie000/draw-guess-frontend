<script setup lang="ts">
import ButtonMain from '@/components/Button/ButtonMain.vue';
import { ref } from 'vue';
import ProfileChangeInfo from './components/ProfileChangeInfo.vue';
import LevelAndGames from './components/LevelAndGames.vue';

const tabIndex = ref(0);

const tabs = [
  {
    title: 'Level & Games',
    component: LevelAndGames
  },
  {
    title: 'Change Info',
    component: ProfileChangeInfo
  }
];
</script>

<template>
  <div class="p-4 flex max-md:flex-col gap-4">
    <div class="flex flex-col gap-2 max-md:px-3">
      <h1 class="text-xl text-center font-bold mb-3">My Profile</h1>
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
