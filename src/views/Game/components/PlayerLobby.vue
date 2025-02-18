<script setup lang="ts">
import type { Player } from '@/typings/interfaces/player.interface';
import userIcon from '@/assets/user.svg';

withDefaults(defineProps<{ player: Player; displayPoints?: boolean }>(), {
  displayPoints: false
});

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
    <span class="max-w-20 truncate mr-auto grow">{{ player.user.username }}</span>
    <span
      v-if="displayPoints"
      class="font-bold text-blue-dark"
    >
      {{ player.points }}
    </span>
  </div>
</template>
