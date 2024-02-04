<script setup lang="ts">
import {
  checkUpdate,
  installUpdate,
  onUpdaterEvent,
} from '@tauri-apps/api/updater'
import { relaunch } from '@tauri-apps/api/process'
const unlisten = await onUpdaterEvent(({ error, status }) => {
  console.log('Updater event', error, status)
})

try {
  const { shouldUpdate, manifest } = await checkUpdate()

  if (shouldUpdate) {
    console.log(
        `Installing update ${manifest?.version}, ${manifest?.date}, ${manifest?.body}`
    )

    await installUpdate()
    await relaunch()
  }
} catch (error) {
  console.error(error)
}

unlisten()
</script>

<template>
<router-view/>
</template>

<style scoped>
@import "./assets/iconfont/iconfont.css";
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
