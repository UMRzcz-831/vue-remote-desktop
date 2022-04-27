<template>
  <NConfigProvider :theme="darkTheme" :theme-overrides="themeOverrides">
    <NNotificationProvider>
      <NMessageProvider>
        <router-view></router-view>
      </NMessageProvider>
    </NNotificationProvider>
  </NConfigProvider>
</template>
<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
import {
  NConfigProvider,
  darkTheme,
  lightTheme,
  NMessageProvider,
  NNotificationProvider,
  GlobalThemeOverrides,
} from 'naive-ui';

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
