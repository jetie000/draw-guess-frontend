<script setup lang="ts">
import { RouterView } from 'vue-router';
import HeaderMain from '@/layout/HeaderMain.vue';
import FooterMain from '@/layout/FooterMain.vue';
import Alert from '@/components/Alert/Alert.vue';
import { onMounted } from 'vue';
import { useUserStore } from './stores/user/userStore';

const userStore = useUserStore();

onMounted(() => {
  userStore.assignToken();
});
</script>

<template>
  <div>
    <HeaderMain />
    <Alert />
    <div class="min-h-[calc(100vh-3rem)] bg-yellow-secondary text-blue-dark">
      <main class="container flex flex-col mx-auto min-h-[calc(100vh-5rem)]">
        <RouterView />
      </main>
      <FooterMain />
    </div>
  </div>
</template>
