<template>
  <div id="main-page">
    <n-layout has-sider>
      <n-layout-sider>
        <SideMenu />
      </n-layout-sider>
      <n-layout-header>777</n-layout-header>
      <div class="handle-bar"></div>
      <n-layout-content>
        <router-view />
      </n-layout-content>
    </n-layout>
  </div>
</template>
<script setup lang="ts">
import SideMenu from '../components/SideMenu/index.vue';
</script>
<style lang="scss" scoped></style>
