<template>
<div v-if="waitingMessage" class="waitingModal">
    <h1>{{ waitingMessage }}</h1>
</div>
</template>

<script setup lang="ts">
const props = defineProps<{ waitingMessage: string }>();
</script>

<style scoped>
.waitingModal {
  position: fixed;
  z-index: 999;
  top: 0;
  left: 0;
  background-color: #ffffffee;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  user-select: none;
}
.dark .waitingModal {
  background-color: #000000dd;
}
</style>