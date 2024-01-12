<template>
  <svg class="svg-icon">
    <use :xlink:href="iconName" />
  </svg>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = defineProps({
  icon: {
    type: String,
    required: true
  }
});
const iconName = computed(() => `#${props.icon}`);

</script>
<style scoped>
.svg-icon {
  width: 1em;
  height: 1em;
  fill: currentColor; /* 这样可以继承父元素的颜色 */
}
</style>
