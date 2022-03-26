<template>
  <div class="side-menu">
    <n-menu :options="menuOptions" :indent="16" />
  </div>
</template>

<script lang="ts" setup>
import { h, Component } from 'vue';
import { MenuOption, NMenu, NIcon } from 'naive-ui';
import { FishOutline as FishIcon } from '@vicons/ionicons5';

function renderIcon(icon: Component) {
  return () => h(NIcon, null, { default: () => h(icon) });
}

const menuOptions: MenuOption[] = [
  {
    label: '远程协助',
    key: 'remote',
    icon: renderIcon(FishIcon),
  },
  {
    label: '设备类别',
    key: 'devices',
    icon: renderIcon(FishIcon),
  },
];
</script>

<style lang="scss" scoped>
.side-menu {
  width: 150px;
  :deep(.n-menu .n-menu-item::before) {
    left: 0;
    right: 16px;
  }
}
</style>
