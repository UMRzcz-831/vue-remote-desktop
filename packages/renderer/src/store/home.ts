import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useHomeStore = defineStore('home', () => {
  const localCode = ref('');
  const setLocalCode = (code: string) => {
    localCode.value = code;
  };
  return { localCode, setLocalCode };
});
