<!-- src>App.vue -->
<template>
  <nav>
    <button @click="toggleTheme" class="darkToggle">
      {{ darkMode ? 'Light Mode' : 'Dark Mode' }}
    </button>
    <router-link :to="`/`">Hem</router-link>
    <router-link :to="`/bookings/`">Mina bokningar</router-link>
  </nav>

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
  .darkToggle {
    margin-right: 10px;
  }
  nav {
    display: flex;
    align-items: center;
    gap: 10px;
    border-bottom: solid 1px;
    padding: 10px;
  }

  @media (max-width: 600px) {
    .grid {
      flex-direction: column;
    }
  }
</style>