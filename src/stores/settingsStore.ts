import {
  defaultVolumeMusicLevel,
  defaultVolumeSoundsLevel,
  maxVolumeLevel,
  storageKeys
} from '@/helpers/constants';
import { defineStore } from 'pinia';

export interface SettingsStore {
  volumeSoundsLevel: number;
  volumeMusicLevel: number;
  sounds: HTMLAudioElement[];
  music: HTMLAudioElement | null;
}

export const useSettingsStore = defineStore('settings', {
  state: (): SettingsStore => ({
    volumeSoundsLevel:
      Number(localStorage.getItem(storageKeys.volumeSoundsLevel)) ?? defaultVolumeMusicLevel,
    volumeMusicLevel:
      Number(localStorage.getItem(storageKeys.volumeMusicLevel)) ?? defaultVolumeSoundsLevel,
    sounds: [],
    music: null
  }),
  actions: {
    setVolumeMusicLevel(volumeLevel: number) {
      localStorage.setItem(storageKeys.volumeMusicLevel, String(volumeLevel));
      this.volumeMusicLevel = volumeLevel;
      if (this.music) {
        this.music.volume = volumeLevel / maxVolumeLevel;
      }
    },
    playMusic(musicFile: string) {
      const music = new Audio(musicFile);
      music.volume = this.volumeMusicLevel / maxVolumeLevel;
      music.autoplay = true;
      music.loop = true;
      this.music = music;
      music.addEventListener('canplaythrough', () => {
        music.play().catch(() => {
          window.addEventListener(
            'click',
            () => {
              music.play();
            },
            { once: true }
          );
        });
      });
    },
    setVolumeSoundsLevel(volumeLevel: number) {
      localStorage.setItem(storageKeys.volumeSoundsLevel, String(volumeLevel));
      this.volumeSoundsLevel = volumeLevel;
      this.sounds.forEach((sound) => {
        sound.volume = volumeLevel / maxVolumeLevel;
      });
    },
    playAudio(audioFile: string, isLooped = false) {
      const audio = new Audio(audioFile);
      audio.volume = this.volumeSoundsLevel / maxVolumeLevel;
      if (isLooped) {
        audio.loop = true;
      }
      audio.autoplay = true;
      this.sounds.push(audio);
      audio.addEventListener('canplaythrough', () => {
        audio.play().catch(() => {
          window.addEventListener(
            'click',
            () => {
              audio.play();
            },
            { once: true }
          );
        });
      });
    }
  }
});
