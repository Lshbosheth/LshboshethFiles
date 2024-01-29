<script setup lang="ts">
import { invoke } from "@tauri-apps/api/tauri";

document.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
    invoke("close_splashscreen")
  }, 2000)
})
</script>

<template>
<router-view/>
</template>

<style scoped>
@import "./assets/iconfont/iconfont.css";
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
