<script setup lang="ts">
import { RouterView } from 'vue-router';
import HeaderMain from '@/layout/HeaderMain.vue';
import FooterMain from '@/layout/FooterMain.vue';
import Alert from '@/layout/Alert.vue';
import { onBeforeMount } from 'vue';
import { useUserStore } from './stores/user/userStore';
import ErrorModal from './layout/ErrorModal.vue';
import { initSocket } from './helpers/socket';
import NewLevelModal from './layout/NewLevelModal.vue';
import AchievementsModal from './layout/AchievementsModal.vue';

const userStore = useUserStore();

onBeforeMount(() => {
  userStore.assignToken();
  initSocket();
});
</script>

<template>
  <div>
    <HeaderMain />
    <Alert />
    <ErrorModal />
    <NewLevelModal />
    <AchievementsModal />
    <div class="min-h-[calc(100vh-3rem)] bg-yellow-secondary text-blue-dark">
      <main class="container flex flex-col mx-auto min-h-[calc(100vh-5rem)]">
        <RouterView />
      </main>
      <FooterMain />
    </div>
  </div>
</template>
