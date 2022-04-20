<template>
  <div class="side-menu">
    <NMenu
      :options="menuOptions"
      :indent="16"
      default-value="home"
      @update:value="handleUpdateValue"
    />
  </div>
</template>

<script lang="ts" setup>
import { h, Component } from 'vue';
import { MenuOption, NMenu, NIcon } from 'naive-ui';
import {
  CompassOutline as CompassIcon,
  DesktopOutline as DesktopIcon,
} from '@vicons/ionicons5';
import { useRouter } from 'vue-router';

const router = useRouter();

function renderIcon(icon: Component) {
  return () => h(NIcon, null, { default: () => h(icon) });
}

const menuOptions: MenuOption[] = [
  {
    label: '远程协助',
    key: 'home',
    icon: renderIcon(CompassIcon),
  },
  {
    label: '设备列表',
    key: 'devices',
    icon: renderIcon(DesktopIcon),
  },
];

const handleUpdateValue = (key: string, item: MenuOption) => {
  router.push('/' + key);
};
</script>

<style lang="scss" scoped>
.side-menu {
  width: 150px;
  :deep(.n-menu .n-menu-item::before) {
    left: 0 !important;
    right: 16px !important;
  }
}
</style>
