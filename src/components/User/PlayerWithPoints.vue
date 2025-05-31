<script setup lang="ts">
import type { Player } from '@/typings/interfaces/player.interface';
import userIcon from '@/assets/user.svg';
import { computed } from 'vue';
import { getLevelAndProgressByExp } from '@/helpers/game';

const props = withDefaults(defineProps<{ player: Player; displayPoints?: boolean }>(), {
  displayPoints: false
});

const replaceByDefault = (event: Event) => {
  (event.target as HTMLImageElement).src = userIcon;
};

const levelAndProgress = computed(() => getLevelAndProgressByExp(props.player.user.experience));
</script>

<template>
  <div class="flex gap-2 relative">
    <img
      class="w-6 h-6 rounded-full"
      :src="player.user.avatarUrl || userIcon"
      alt="User"
      @error="replaceByDefault"
    />
    <div
      class="absolute h-4 min-w-4 -top-2 left-4 text-xs text-center align-middle px-1 rounded-full border border-blue-dark"
      :style="{
        background: levelAndProgress.background,
        color: levelAndProgress.color
      }"
    >
      {{ levelAndProgress.level }}
    </div>
    <div
      class="absolute left-0 -bottom-1 w-6 h-1.5 border border-blue-dark"
      :style="{
        background: levelAndProgress.background
      }"
    >
      <div
        :style="{
          background: levelAndProgress.color,
          width: `${levelAndProgress.progress}%`,
          height: '100%'
        }"
      />
    </div>
    <span class="truncate mr-auto grow ml-1">{{ player.user.username }}</span>
    <span
      v-if="displayPoints"
      class="font-bold text-blue-dark"
    >
      {{ player.points }}
    </span>
  </div>
</template>
