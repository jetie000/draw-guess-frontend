<script setup lang="ts">
import { ArrowLeftStartOnRectangleIcon } from '@heroicons/vue/16/solid';
import {
  MusicalNoteIcon,
  SpeakerWaveIcon,
  SpeakerXMarkIcon,
  XMarkIcon
} from '@heroicons/vue/24/outline';
import { maxVolumeLevel } from '@/helpers/constants';
import coinImg from '@/assets/coin.svg';
import { storeToRefs } from 'pinia';
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import userIcon from '@/assets/user.svg';
import Dropdown from '@/components/Dropdown/Dropdown.vue';
import { handleNetworkError } from '@/helpers/errors';
import { getLevelAndProgressByExp } from '@/helpers/game';
import { useMutation, useQueryClient } from '@tanstack/vue-query';
import { UserApi } from '@/api/user/user.api';
import { QueryKeys } from '@/api/query-keys';
import { useSettingsStore } from '@/stores/settingsStore';
import { useUserStore } from '@/stores/user/userStore';
import type { ProfileExtended } from '@/api/user/user.api.interface';
import { SocketEventKeys } from '@/helpers/socket/event-keys';
import type { Achievement } from '@/api/user/user.api.interface';
import levelUpAudio from '@/assets/sounds/level-up.wav';
import { onMounted, onUnmounted } from 'vue';
import { useModalStore } from '@/stores/modal/modalStore';
import { socket } from '@/helpers/socket';
import { moneyForAchievementAmountByLevel } from '@/helpers/achievements';

const props = defineProps<{
  user: ProfileExtended | undefined;
}>();

const userStore = useUserStore();
const settingsStore = useSettingsStore();
const { volumeSoundsLevel, volumeMusicLevel } = storeToRefs(settingsStore);

const router = useRouter();
const dropdown = ref<InstanceType<typeof Dropdown> | null>(null);
const queryClient = useQueryClient();

const { mutate: logout, isPending } = useMutation({
  mutationFn: UserApi.logout,
  onSuccess: () => {
    userStore.removeToken();
    router.push('/login');
    queryClient.resetQueries({ queryKey: [QueryKeys.Profile] });
    queryClient.clear();
  },
  onError: (logoutError) => {
    handleNetworkError(logoutError);
  }
});

onMounted(() => {
  socket.on(
    SocketEventKeys.AchievementsEarned,
    ({ achievements, userId }: { achievements: Achievement[]; userId: number }) => {
      if (userId === props.user?.id) {
        useModalStore().showAchievementsModal(
          achievements.map((achievement) => ({
            ...achievement,
            money: moneyForAchievementAmountByLevel[achievement.level - 1]
          }))
        );
        useSettingsStore().playAudio(levelUpAudio);
        const moneyEarned = achievements.reduce(
          (acc, achievement) => acc + moneyForAchievementAmountByLevel[achievement.level - 1],
          0
        );
        queryClient.setQueryData([QueryKeys.Profile], (profile: ProfileExtended) => ({
          ...profile,
          money: profile.money + moneyEarned
        }));
      }
    }
  );
});

onUnmounted(() => {
  socket.off(SocketEventKeys.AchievementsEarned);
});

const replaceAvatarByDefault = (event: Event) => {
  (event.target as HTMLImageElement).src = userIcon;
};
const levelAndProgress = computed(
  () => props.user && getLevelAndProgressByExp(props.user.experience)
);
</script>

<template>
  <div class="flex items-center ml-auto">
    <div
      v-if="user"
      class="flex items-center gap-1 mr-7 max-xsm:mr-4"
    >
      <img
        class="w-8 h-8"
        :src="coinImg"
        alt="coin"
      />
      <span class="font-bold text-yellow-950">{{ user.money }}</span>
    </div>
    <Dropdown
      ref="dropdown"
      class="flex"
      trigger-wrapper-class="flex"
      align="right"
    >
      <template #trigger>
        <button
          :disabled="isPending"
          class="transition-all rounded-full border border-transparent hover:border-blue-dark relative shrink-0"
        >
          <img
            class="w-8 h-8 rounded-full"
            :src="user?.avatarUrl || userIcon"
            alt="Avatar"
            @error="replaceAvatarByDefault"
          />
          <template v-if="levelAndProgress">
            <div
              class="absolute h-4 min-w-4 -top-1 left-5 text-xs text-center align-middle px-1 rounded-full border border-blue-dark"
              :style="{
                background: levelAndProgress.background,
                color: levelAndProgress.color
              }"
            >
              {{ levelAndProgress.level }}
            </div>
            <div
              class="absolute left-1 -bottom-1 w-6 h-1.5 border border-blue-dark"
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
          </template>
        </button>
      </template>
      <div class="flex bg-white border rounded-md py-2 flex-col">
        <RouterLink
          to="/profile"
          class="cursor-pointer hover:bg-blue-100 py-1 px-4 text-center"
          @click="() => dropdown?.hideMenu()"
        >
          My Profile
        </RouterLink>
        <RouterLink
          to="/achievements"
          class="cursor-pointer hover:bg-blue-100 py-1 px-4 text-center"
          @click="() => dropdown?.hideMenu()"
        >
          Achievements
        </RouterLink>
        <div class="px-4 py-2 pb-1 flex gap-2 items-center">
          <SpeakerWaveIcon
            v-if="volumeSoundsLevel > 0"
            class="w-6 h-6"
          />
          <SpeakerXMarkIcon
            v-else
            class="w-6 h-6"
          />
          <input
            :value="volumeSoundsLevel"
            id="duration-range"
            type="range"
            :max="maxVolumeLevel / 2"
            min="0"
            step="0.25"
            class="w-full h-1 bg-gray-300 appearance-none cursor-pointer"
            @input="
              (e) =>
                settingsStore.setVolumeSoundsLevel(Number((e.target as HTMLInputElement).value))
            "
          />
        </div>
        <div class="px-4 py-2 flex gap-2 items-center">
          <MusicalNoteIcon class="w-6 h-6 relative" />
          <XMarkIcon
            v-if="volumeMusicLevel === 0"
            class="w-6 h-6 absolute left-[15px]"
          />
          <input
            :value="volumeMusicLevel"
            id="duration-range"
            type="range"
            :max="maxVolumeLevel / 2"
            min="0"
            step="0.25"
            class="w-full h-1 bg-gray-300 appearance-none cursor-pointer"
            @input="
              (e) => settingsStore.setVolumeMusicLevel(Number((e.target as HTMLInputElement).value))
            "
          />
        </div>
        <div
          class="flex items-center justify-center gap-2 flex-nowrap px-4 py-1 hover:bg-blue-100 cursor-pointer"
          @click="() => !isPending && logout()"
        >
          <span class="whitespace-nowrap">Log out</span>
          <ArrowLeftStartOnRectangleIcon class="inline w-5 h-5 shrink-0" />
        </div>
      </div>
    </Dropdown>
  </div>
</template>
