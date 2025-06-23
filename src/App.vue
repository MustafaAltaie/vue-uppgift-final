<template>
  <button @click="toggleTheme">
    {{ darkMode ? 'Light Mode' : 'Dark Mode' }}
  </button>

  <router-view />
</template>

<script setup lang="ts">
import { useDarkMode } from './composables/useDarkMode.ts';

const { darkMode, toggleTheme } = useDarkMode();
</script>

<style>
:root {
  --bg-color: white;
  --text-color: black;
}
.dark {
  --bg-color: #121212;
  --text-color: white;
}
body {
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 1rem;
  background-color: var(--bg-color);
  color: var(--text-color);
}

@media (max-width: 600px) {
  .grid {
    flex-direction: column;
  }
}
</style>