<template>
	<NConfigProvider :theme="darkTheme">
		<NMessageProvider>
			<router-view></router-view>
		</NMessageProvider>
	</NConfigProvider>
</template>
<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
import { NConfigProvider, darkTheme, NMessageProvider } from 'naive-ui'
</script>
<style>
html,
body {
	margin: 0;
	padding: 0;
	background: #222;
}
.logo-box {
	display: flex;
	width: 100%;
	justify-content: center;
}
</style>
