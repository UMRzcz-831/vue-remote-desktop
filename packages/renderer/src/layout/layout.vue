<template>
  <div id="main-page">
    <NLayout class="main-layout">
      <!-- <NLayoutHeader><div class="handle-bar">999</div></NLayoutHeader> -->
      <NLayout has-sider>
        <NLayoutSider :width="150" bordered>
          <LoginStatus />
          <SideMenu />
        </NLayoutSider>
        <NLayoutContent>
          <router-view />
        </NLayoutContent>
      </NLayout>
    </NLayout>
  </div>
</template>
<script setup lang="ts">
import { NLayout, NLayoutContent, NLayoutSider, NLayoutHeader } from 'naive-ui';
import SideMenu from '../components/SideMenu/index.vue';
import LoginStatus from '../components/LoginStatus';
</script>
<style lang="scss" scoped>
.main-layout {
  min-height: 100vh;
}
.n-layout-sider {
  height: 100vh;
}

</style>
