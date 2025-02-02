<script setup lang="ts">
import type { Player } from '@/typings/interfaces/player.interface';
import userIcon from '@/assets/user.svg';

defineProps<{ player: Player }>();

const replaceByDefault = (event: Event) => {
  (event.target as HTMLImageElement).src = userIcon;
};
</script>
<template>
  <div class="flex gap-2">
    <img
      class="w-6 h-6 rounded-md"
      :src="player.user.avatarUrl || userIcon"
      alt="User"
      @error="replaceByDefault"
    />
    <span class="max-w-20 truncate">{{ player.user.username }}</span>
  </div>
</template>
