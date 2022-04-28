<template>
  <NConfigProvider
    :theme="theme"
    :theme-overrides="preference.theme === '1' ? themeOverrides : null"
  >
    <NNotificationProvider>
      <NMessageProvider>
        <router-view></router-view>
      </NMessageProvider>
    </NNotificationProvider>
  </NConfigProvider>
</template>
<script setup lang="ts">
import {
  NConfigProvider,
  darkTheme,
  lightTheme,
  NMessageProvider,
  NNotificationProvider,
  GlobalThemeOverrides,
} from 'naive-ui';
import { computed, watch, ref } from 'vue';
import { useUserStore } from './store/index';
import { storeToRefs } from 'pinia';

const userSetup = useUserStore();
const { preference } = storeToRefs(userSetup);

const theme = ref(preference.value.theme === '1' ? darkTheme : lightTheme);
console.log('theme', preference.value.theme);

watch(preference, (newV) => {
  theme.value = newV.theme === '1' ? darkTheme : lightTheme;
});

const themeOverrides: GlobalThemeOverrides = {
  //   common: {
  //     primaryColor: '#2c3e50',
  //   },
  Layout: {
    color: '#222',
    headerColor: '#222',
    siderColor: '#222',
  },
  Card: {
    color: '#222',
  },
};
</script>
<style></style>
