import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useDeviceStore = defineStore('device', () => {
  const isMobile = ref(false);

  const setIsMobile = (value) => {
    isMobile.value = value;
  };

  return {
    isMobile,
    setIsMobile,
  };
});